import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import { initialState as initialChatState, setAnswers } from "@/core/store/chatSlice";
import Message from "./Message";
import MessageInputs from "./MessageInputs";
import CredentialsContainer from "./CredentialsContainer";
import RunButton from "@/components/GPT/RunButton";
import type { IAnswer, IMessage } from "@/components/Prompt/Types/chat";
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
import { createMessage } from "@/components/Chat/helper";

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

  const [showInputs, setShowInputs] = useState(false);

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

  const executeWorkflow = async (answers?: IAnswer[]) => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    try {
      dispatch(setGeneratingStatus(true));

      const webhook = extractWebhookPath(clonedWorkflow.nodes);

      const response = await sendMessageAPI(webhook, answers);
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

  const retryRunWorkflow = async (executionAnswers: IAnswer[]) => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    if (executionAnswers?.length) {
      dispatch(setAnswers(executionAnswers));
    }

    executeWorkflow(executionAnswers);
    scrollToInputsForm();
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

  const handleRunWorkflow = (runFn: () => void) => {
    setShowInputs(false);
    runFn();
  };

  const cloneExecutionAnswers = (answers: IAnswer[]) => {
    if (answers?.length) {
      dispatch(setAnswers(answers));
    }
    setShowInputs(true);
    scrollToInputsForm();
  };

  const scrollToInputsForm = () => {
    setTimeout(() => scrollTo("#inputs_form", headerHeight), 300);
  };

  const hasInputs = inputs.length > 0;
  const allowNoInputsRun = !hasInputs && areCredentialsStored && showGenerate && currentUser?.id && !isGenerating;
  const hasExecution = messages.some(msg => msg.type === "workflowExecution");
  const showInputsForm = hasInputs && !generatedExecution && (showInputs || !hasExecution || isGenerating);

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
                    retryExecution={() => handleRunWorkflow(() => retryRunWorkflow(msg.data as IAnswer[]))}
                    showInputs={() => cloneExecutionAnswers(msg.data as IAnswer[])}
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

          {showInputsForm && (
            <Box id="inputs_form">
              <MessageInputs
                allowGenerate={Boolean(showGenerate || allowNoInputsRun)}
                onGenerate={() => handleRunWorkflow(executeWorkflow)}
                message={createMessage({
                  type: "form",
                  noHeader: true,
                })}
                isExecuting={isGenerating}
              />
            </Box>
          )}

          {allowNoInputsRun && (
            <Stack
              alignItems={"start"}
              justifyContent={"start"}
            >
              <RunButton
                onClick={() => handleRunWorkflow(executeWorkflow)}
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
