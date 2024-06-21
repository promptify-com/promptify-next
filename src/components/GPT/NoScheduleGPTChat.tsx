import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import Message from "./Message";
import MessageInputs from "./MessageInputs";
import CredentialsContainer from "./CredentialsContainer";
import RunButton from "@/components/GPT/RunButton";
import type { IMessage, MessageType } from "@/components/Prompt/Types/chat";
import type { ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import ChatCredentialsPlaceholder from "./ChatCredentialsPlaceholder";
import { useScrollToElement } from "@/hooks/useScrollToElement";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { N8N_RESPONSE_REGEX, extractWebhookPath } from "@/components/Automation/helpers";
import { setToast } from "@/core/store/toastSlice";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import type { PromptLiveResponse } from "@/common/types/prompt";
import { EXECUTE_ERROR_TOAST } from "@/components/Prompt/Constants";
import { useUpdateWorkflowMutation } from "@/core/api/workflows";
import useBrowser from "@/hooks/useBrowser";
import { theme } from "@/theme";

interface Props {
  messages: IMessage[];
  showGenerate: boolean;
  processData: (skipInitialMessages?: boolean) => Promise<void>;
  workflow: ITemplateWorkflow;
  messageWorkflowExecution: (message: string, workflowData: IWorkflowCreateResponse) => void;
}

function NoScheduleGPTChat({ messages, showGenerate, workflow, messageWorkflowExecution }: Props) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();

  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const currentUser = useAppSelector(state => state.user?.currentUser ?? null);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const { inputs = [], areCredentialsStored, clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);

  const { sendMessageAPI } = useWorkflow(workflow);
  const { streamExecutionHandler } = useGenerateExecution({});

  const [updateWorkflowHandler] = useUpdateWorkflowMutation();

  const updateWorkflow = async (workflowData: IWorkflowCreateResponse) => {
    try {
      return await updateWorkflowHandler({
        workflowId: workflowData.id,
        data: workflowData,
      }).unwrap();
    } catch (error) {
      console.error("Updating workflow failed", error);
    }
  };

  const scrollTo = useScrollToElement("smooth");
  const headerHeight = parseFloat(isMobile ? theme.custom.headerHeight.xs : theme.custom.headerHeight.md);
  const scrollToBottom = () => {
    scrollTo("#scroll_ref", headerHeight);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [messages, generatedExecution]);

  const executeWorkflow = async () => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    try {
      dispatch(setGeneratingStatus(true));

      const webhook = extractWebhookPath(clonedWorkflow.nodes);

      const response = await sendMessageAPI(webhook);
      if (response && typeof response === "string") {
        if (response.toLowerCase().includes("[error")) {
          failedExecutionHandler();
        } else {
          const match = new RegExp(N8N_RESPONSE_REGEX).exec(response);

          if (!match) {
            messageWorkflowExecution(response, clonedWorkflow);
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
      dispatch(setGeneratingStatus(false));
    }
  };

  const retryRunWorkflow = async (executionWorkflow: IWorkflowCreateResponse) => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    const { periodic_task: currentPeriodicTask } = clonedWorkflow;
    const { periodic_task: executionPeriodicTask } = executionWorkflow;
    const noInputsChange = currentPeriodicTask?.kwargs === executionPeriodicTask?.kwargs;

    const updatedWorkflow = noInputsChange ? executionWorkflow : await updateWorkflow(executionWorkflow);

    if (updatedWorkflow) {
      executeWorkflow();
      if (!noInputsChange) {
        updateWorkflow(structuredClone(clonedWorkflow));
      }
    }
  };

  const failedExecutionHandler = () => {
    dispatch(setToast(EXECUTE_ERROR_TOAST));
    dispatch(setGeneratedExecution(null));
  };

  const messageGeneratedExecution = (execution: PromptLiveResponse) => {
    if (clonedWorkflow) {
      const title = execution.temp_title;
      const promptsOutput = execution.data.map(data => data.message).join(" ");
      const output = title ? `# ${title}\n\n${promptsOutput}` : promptsOutput;
      messageWorkflowExecution(output, clonedWorkflow);
    }
  };

  // Pass run workflow generated execution as a new message after all prompts completed
  useEffect(() => {
    if (generatedExecution?.data?.length && generatedExecution.hasNext === false) {
      messageGeneratedExecution(generatedExecution);
      dispatch(setGeneratedExecution(null));
    }
  }, [generatedExecution]);

  const hasInputs = inputs.length > 0;
  const allowNoInputsRun = !hasInputs && areCredentialsStored && showGenerate && currentUser?.id && !isGenerating;

  function showForm(messageType: MessageType): boolean {
    return Boolean((messageType === "credentials" && !areCredentialsStored) || (messageType === "form" && hasInputs));
  }

  return (
    <Stack
      gap={3}
      mx={{ xs: "16px", md: "40px" }}
      position={"relative"}
    >
      <Stack
        pb={{ md: "38px" }}
        direction={"column"}
        gap={3}
      >
        <Stack
          mt={6}
          gap={3}
          direction={"column"}
          width={"100%"}
        >
          {!!messages.length ? (
            messages.map((msg, idx) => (
              <Box key={msg.id}>
                {!generatedExecution && idx === messages.length - 1 && <div id="scroll_ref"></div>}

                {msg.type === "text" && (
                  <Message
                    isInitialMessage={idx === 0}
                    message={msg}
                  />
                )}
                {msg.type === "workflowExecution" && (
                  <Message
                    message={msg}
                    retryExecution={() => retryRunWorkflow(msg.data as IWorkflowCreateResponse)}
                  />
                )}

                {showForm(msg.type) && msg.type === "form" && (
                  <MessageInputs
                    allowGenerate={Boolean(showGenerate || allowNoInputsRun)}
                    onGenerate={executeWorkflow}
                    message={msg}
                    isExecuting={isGenerating}
                  />
                )}

                {msg.type === "credentials" && (
                  <CredentialsContainer
                    message={"Insert your credentials:"}
                    workflow={workflow}
                  />
                )}
              </Box>
            ))
          ) : (
            <ChatCredentialsPlaceholder />
          )}
          {allowNoInputsRun && (
            <Stack
              alignItems={"start"}
              justifyContent={"start"}
            >
              <RunButton
                onClick={executeWorkflow}
                showIcon
                loading={isGenerating}
              />
            </Stack>
          )}

          {generatedExecution && (
            <>
              <ExecutionMessage execution={generatedExecution} />
              <div
                id="scroll_ref"
                style={{ marginTop: "-64px" }}
              ></div>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default NoScheduleGPTChat;
