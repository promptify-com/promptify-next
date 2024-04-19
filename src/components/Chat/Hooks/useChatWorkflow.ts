import { useEffect, type Dispatch, type SetStateAction } from "react";

import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { N8N_RESPONSE_REGEX, oAuthTypeMapping } from "@/components/Automation/helpers";
import { setAreCredentialsStored, setChatMode, setInputs } from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import { createMessage } from "@/components/Chat/helper";
import type { ICredentialInput, INode, IWorkflow } from "@/components/Automation/types";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { IPromptInput } from "@/common/types/prompt";
import { setToast } from "@/core/store/toastSlice";
import { EXECUTE_ERROR_TOAST } from "@/components/Prompt/Constants";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import useSaveChatInteractions from "./useSaveChatInteractions";

interface Props {
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
  setIsValidatingAnswer: Dispatch<SetStateAction<boolean>>;
  queueSavedMessages: IMessage[];
  setQueueSavedMessages: Dispatch<SetStateAction<IMessage[]>>;
}

const useChatWorkflow = ({ setMessages, setIsValidatingAnswer, queueSavedMessages, setQueueSavedMessages }: Props) => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(state => state.user.currentUser);
  const { selectedWorkflow, selectedChat } = useAppSelector(state => state.chat);
  const { generatedExecution } = useAppSelector(state => state.executions);

  const { createWorkflowIfNeeded, sendMessageAPI } = useWorkflow(selectedWorkflow ?? ({} as IWorkflow));
  const { processQueuedMessages } = useSaveChatInteractions();

  const { extractCredentialsInputFromNodes, checkAllCredentialsStored } = useCredentials();
  const { streamExecutionHandler } = useGenerateExecution({});

  const processWorflowData = async () => {
    if (selectedWorkflow?.data) {
      const { nodes } = selectedWorkflow.data;
      const credentialsInput = await extractCredentialsInputFromNodes(nodes);

      if (currentUser?.id) {
        createWorkflowIfNeeded(selectedWorkflow.id);
      }

      const inputs: IPromptInput[] = nodes
        .filter(node => node.type === "n8n-nodes-base.set")
        .flatMap(node => node.parameters.fields?.values ?? [])
        .map(value => ({
          name: value.name,
          fullName: value.name,
          type: "text",
          required: true,
        }));

      dispatch(setInputs(inputs));
      prepareWorkflowMessages(credentialsInput, nodes);
    }
  };

  function prepareWorkflowMessages(credentialsInput: ICredentialInput[], nodes: INode[]) {
    const runMessage = createMessage({ type: "text", fromUser: true, text: `Run "${selectedWorkflow?.name}"` });

    setQueueSavedMessages(prevMessages => prevMessages.concat(runMessage));

    setMessages(prevMessages => {
      let lastSuggestionWorkflowIndex = -1;
      for (let i = prevMessages.length - 1; i >= 0; i--) {
        if (prevMessages[i].type === "suggestion-workflows") {
          lastSuggestionWorkflowIndex = i;
          break;
        }
      }

      const filteredMessages = prevMessages.slice(0, lastSuggestionWorkflowIndex + 1);

      return filteredMessages.concat(runMessage);
    });

    const initialWorkflowMessages: IMessage[] = [];
    const requiresAuthentication = nodes.some(node => node.parameters?.authentication);
    const requiresOauth = nodes.some(node => oAuthTypeMapping[node.type]);

    let areAllCredentialsStored = true;
    if (requiresAuthentication || requiresOauth) {
      areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);
    }
    dispatch(setAreCredentialsStored(areAllCredentialsStored));

    if (!areAllCredentialsStored) {
      const credMessage = createMessage({ type: "credentials", noHeader: true, text: "" });
      initialWorkflowMessages.push(credMessage);
    }

    const formMessage = createMessage({
      type: "credsForm",
      noHeader: true,
      text: `Hi, ${
        currentUser?.first_name ?? currentUser?.username ?? "There"
      }! Ready to work on ${selectedWorkflow?.name}.`,
    });
    initialWorkflowMessages.push(formMessage);

    setMessages(prevMessages => prevMessages.concat(initialWorkflowMessages));
  }

  const executeWorkflow = async () => {
    try {
      setIsValidatingAnswer(true);
      const response = await sendMessageAPI();
      if (response && typeof response === "string") {
        if (response.toLowerCase().includes("[error")) {
          failedExecutionHandler();
        } else {
          const match = new RegExp(N8N_RESPONSE_REGEX).exec(response);

          if (!match) {
            const responseMessage = createMessage({ type: "html", text: response });
            const formMessage = createMessage({
              type: "credsForm",
              noHeader: true,
              text: "",
            });
            setMessages(prevMessages =>
              prevMessages.filter(msg => msg.type !== "credsForm").concat([responseMessage, formMessage]),
            );
          } else if (!match[2] || match[2] === "undefined") {
            failedExecutionHandler();
          } else {
            streamExecutionHandler(response);
          }
        }
      }
    } catch (error) {
      failedExecutionHandler();
    } finally {
      setIsValidatingAnswer(false);
    }
  };

  const failedExecutionHandler = () => {
    dispatch(setToast(EXECUTE_ERROR_TOAST));
    dispatch(setGeneratedExecution(null));
  };

  useEffect(() => {
    const generatedContent = generatedExecution?.data?.map(promptExec => promptExec.message).join(" ") ?? "";

    if (selectedChat && generatedExecution?.hasNext === false) {
      const executionMessage = createMessage({
        type: "html",
        text: generatedContent,
      });
      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "credsForm").concat(executionMessage));
      processQueuedMessages(
        queueSavedMessages.concat(executionMessage),
        selectedChat.id,
        generatedExecution.id as number,
      );
      setQueueSavedMessages([]);
    }
  }, [generatedExecution]);

  return { processWorflowData, executeWorkflow };
};

export default useChatWorkflow;
