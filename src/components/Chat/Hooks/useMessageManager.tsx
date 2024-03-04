import { useEffect, useMemo, useState } from "react";

import { randomId } from "@/common/helpers";
import { extractTemplateIDs, fetchData, sendMessageAPI } from "@/components/Chat/helper";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useChatBox from "@/hooks/useChatBox";
import { setAnswers, setInputs, setIsSimulationStreaming, setParams, setParamsValues } from "@/core/store/chatSlice";
import type { IPromptInput } from "@/common/types/prompt";
import type { Templates } from "@/core/api/dto/templates";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type { PromptParams } from "@/core/api/dto/prompts";

interface CreateMessageProps {
  type: MessageType;
  fromUser?: boolean;
  noHeader?: boolean;
  timestamp?: string;
}

const useMessageManager = () => {
  const dispatch = useAppDispatch();

  const { prepareAndRemoveDuplicateInputs } = useChatBox();

  const { selectedTemplate, answers, isSimulationStreaming, selectedChatOption } = useAppSelector(state => state.chat);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const [suggestedTemplates, setSuggestedTemplates] = useState<Templates[]>([]);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const [chatMode, setChatMode] = useState<"automation" | "messages">("automation");

  const createMessage = ({
    type,
    timestamp = new Date().toISOString(),
    fromUser = false,
    noHeader = false,
  }: CreateMessageProps) => ({
    id: randomId(),
    text: "",
    type,
    createdAt: timestamp,
    fromUser,
    noHeader,
  });

  const addToQueuedMessages = (messages: IMessage[]) => {
    setTimeout(() => {
      setQueuedMessages(messages);
    }, 10);
  };

  const proceedQueuedMessages = () => {
    if (!isSimulationStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.shift()!;
      dispatch(setIsSimulationStreaming(true));
      setMessages(currentMessages => currentMessages.concat(nextQueuedMessage));
      addToQueuedMessages(queuedMessages);
    }
  };

  useEffect(() => {
    proceedQueuedMessages();
  }, [isSimulationStreaming, queuedMessages]);

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }
    const runMessage = createMessage({ type: "text", fromUser: true });
    runMessage.text = `Run "${selectedTemplate.title}"`;
    setMessages(prevMessages => prevMessages.concat(runMessage));
  }, [selectedTemplate]);

  const initialMessages = ({ questions }: { questions: IPromptInput[] }) => {
    const greeting = `Hi, ${currentUser?.first_name ?? currentUser?.username ?? "There"}! Ready to work on`;
    const filteredQuestions = questions.map(_q => _q.question).filter(Boolean);

    const welcomeMessage = createMessage({ type: "text" });
    welcomeMessage.text = `${greeting}, ${
      filteredQuestions.length ? "? " + filteredQuestions.slice(0, 3).join(" ") : ""
    }`;

    dispatch(setAnswers([]));

    if (selectedChatOption === "FORM") {
      const formMessage = createMessage({ type: "form", noHeader: true });
      formMessage.text = welcomeMessage.text;
      setMessages(prevMessages => prevMessages.concat(formMessage));
    }
  };

  const [_inputs, _params]: [IPromptInput[], PromptParams[], boolean] = useMemo(() => {
    if (!selectedTemplate || !selectedChatOption) {
      return [[], [], false];
    }

    const { inputs, params, promptHasContent, paramsValues } = prepareAndRemoveDuplicateInputs(
      selectedTemplate.prompts,
      selectedTemplate.questions,
    );

    dispatch(setParamsValues(paramsValues));

    initialMessages({ questions: inputs });

    dispatch(setParams(params));
    dispatch(setInputs(inputs));

    return [inputs, params, promptHasContent];
  }, [selectedChatOption]);

  const automationSubmitMessage = async (input: string) => {
    if (input) {
      const userMessage = createMessage({ type: "text", fromUser: true });
      userMessage.text = input;

      setMessages(prevMessages => prevMessages.concat(userMessage));
      setIsValidatingAnswer(true);

      const botMessage: IMessage = {
        id: randomId(),
        text: "",
        createdAt: new Date().toISOString(),
        fromUser: false,
        type: "text",
      };

      try {
        const sendMessageResponse = await sendMessageAPI(input);

        if (sendMessageResponse.message) {
          botMessage.text = sendMessageResponse.message;
        } else {
          const templateIDs = extractTemplateIDs(sendMessageResponse.output!);

          if (!templateIDs.length) {
            botMessage.text = sendMessageResponse.output!;
          } else {
            if (!!templateIDs.length) {
              const templates = await fetchData(templateIDs);
              setSuggestedTemplates(templates);
              const suggestionsMessage = createMessage({ type: "suggestedTemplates" });
              suggestionsMessage.text = "I found this prompts, following your request:";

              setMessages(prevMessages => prevMessages.concat(suggestionsMessage));
            }
          }
        }
      } catch (err) {
        botMessage.text = "Oops! I couldn't get your request, Please try again. " + err;
      } finally {
        setIsValidatingAnswer(false);
      }

      if (botMessage.text !== "") {
        setMessages(prevMessages => prevMessages.concat(botMessage));
      }
    }
  };

  const handleSubmitInput = (input: string) => (chatMode === "automation" ? automationSubmitMessage(input) : () => {});

  return { messages, handleSubmitInput, isValidatingAnswer, suggestedTemplates };
};

export default useMessageManager;
