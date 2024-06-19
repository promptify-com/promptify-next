import { useState, useEffect } from "react";

import { randomId } from "@/common/helpers";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState, setAreCredentialsStored } from "@/core/store/chatSlice";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { oAuthTypeMapping } from "@/components/Automation/helpers";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type { ICredentialInput, INode } from "@/components/Automation/types";

interface Props {
  initialMessageTitle: string;
}

interface CreateMessageProps {
  type: MessageType;
  fromUser?: boolean;
  noHeader?: boolean;
  timestamp?: string;
  text?: string;
}

function useMessageManager({ initialMessageTitle }: Props) {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const { inputs, answers } = useAppSelector(state => state.chat ?? initialChatState);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);

  const { checkAllCredentialsStored } = useCredentials();

  const showGenerate =
    //  (showGenerateButton || Boolean(!inputs.length || !inputs[0]?.required))
    (showGenerateButton && messages[messages.length - 1]?.type !== "spark") ||
    Boolean(!inputs.length || !inputs[0]?.required);

  const createMessage = ({
    type,
    timestamp = new Date().toISOString(),
    fromUser = false,
    noHeader = false,
    text = "",
  }: CreateMessageProps) => ({
    id: randomId(),
    text,
    type,
    createdAt: timestamp,
    fromUser,
    noHeader,
  });

  function prepareAndQueueMessages(credentialsInput: ICredentialInput[], nodes: INode[]) {
    const welcomeMessage = createMessage({
      type: "text",
      text: `Hi, ${
        currentUser?.first_name ?? currentUser?.username ?? "There"
      }! Ready to work on, ${initialMessageTitle}`,
    });

    const initialMessages: IMessage[] = [welcomeMessage];

    const requiresAuthentication = nodes.some(node => node.parameters?.authentication);
    const requiresOauth = nodes.some(node => oAuthTypeMapping[node.type]);

    let areAllCredentialsStored = true;
    if (requiresAuthentication || requiresOauth) {
      areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);
    }
    dispatch(setAreCredentialsStored(areAllCredentialsStored));

    if (requiresAuthentication || requiresOauth) {
      const credMessage = createMessage({ type: "credentials", noHeader: true });
      initialMessages.push(credMessage);
    }
    const formMessage = createMessage({ type: "form", noHeader: true });
    initialMessages.push(formMessage);

    setMessages(initialMessages);
  }

  const messageAnswersForm = (message: string, type: MessageType = "text") => {
    const botMessage = createMessage({ type, noHeader: true });
    botMessage.text = message;
    setMessages(prevMessages => prevMessages.concat(botMessage));
  };

  function allRequiredInputsAnswered(): boolean {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);

    if (!requiredQuestionNames.length) {
      return true;
    }

    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));

    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  }

  useEffect(() => {
    if (allRequiredInputsAnswered()) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [answers, inputs]);

  return {
    messages,
    setMessages,
    prepareAndQueueMessages,
    messageAnswersForm,
    createMessage,
    showGenerateButton,
    showGenerate,
    isValidatingAnswer,
    setIsValidatingAnswer,
  };
}

export default useMessageManager;
