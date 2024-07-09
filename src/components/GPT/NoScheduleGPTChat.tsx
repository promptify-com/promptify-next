import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";
import { initialState as initialChatState, setAnswers, setGptGenerationStatus } from "@/core/store/chatSlice";
import Message from "./Message";
import MessageInputs from "./MessageInputs";
import CredentialsContainer from "./CredentialsContainer";
import type { IAnswer, IMessage } from "@/components/Prompt/Types/chat";
import type { ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import ChatCredentialsPlaceholder from "./ChatCredentialsPlaceholder";
import { useScrollToElement } from "@/hooks/useScrollToElement";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import { N8N_RESPONSE_REGEX, extractWebhookPath } from "@/components/Automation/helpers";
import { setToast } from "@/core/store/toastSlice";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import type { PromptLiveResponse } from "@/common/types/prompt";
import { EXECUTE_ERROR_TOAST } from "@/components/Prompt/Constants";
import { useSaveGPTDocumentMutation } from "@/core/api/workflows";
import useBrowser from "@/hooks/useBrowser";
import { theme } from "@/theme";
import { createMessage } from "@/components/Chat/helper";
import RunButtonWithProgressBar from "./RunButtonWithProgressBar";

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

  const currentUser = useAppSelector(state => state.user?.currentUser ?? null);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const {
    inputs = [],
    areCredentialsStored,
    clonedWorkflow,
    gptGenerationStatus,
  } = useAppSelector(state => state.chat ?? initialChatState);

  const { sendMessageAPI } = useWorkflow(workflow);
  const { streamExecutionHandler } = useGenerateExecution({});

  const [saveAsGPTDocument] = useSaveGPTDocumentMutation();

  const [showInputsAfterExecution, setShowInputsAfterExecution] = useState(true);

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
      dispatch(setGptGenerationStatus("started"));

      const webhook = extractWebhookPath(clonedWorkflow.nodes);

      const response = await sendMessageAPI(webhook, answers);

      dispatch(setGptGenerationStatus("generated"));
      setShowInputsAfterExecution(false);

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
            dispatch(setGptGenerationStatus("streaming"));
            await streamExecutionHandler(response);
          }
        }
      }
    } catch (error) {
      failedExecutionHandler();
    } finally {
      dispatch(setGptGenerationStatus("pending"));
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

  const cloneExecutionAnswers = (answers: IAnswer[]) => {
    if (answers?.length) {
      dispatch(setAnswers(answers));
    }
    setShowInputsAfterExecution(true);
    scrollToInputsForm();
  };

  const saveGPTDocument = async (_: IWorkflowCreateResponse, content: string) => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    try {
      await saveAsGPTDocument({
        output: content,
        title: clonedWorkflow.name,
        workflow_id: clonedWorkflow.id,
      });
      dispatch(setToast({ message: "Document added successfully", severity: "success", duration: 6000 }));
      return true;
    } catch (error) {
      console.error(error);
      dispatch(setToast({ message: "DOcument not created! Please try again.", severity: "error", duration: 6000 }));
    }

    return false;
  };

  const scrollToInputsForm = () => {
    setTimeout(() => scrollTo("#inputs_form", headerHeight), 300);
  };

  const hasInputs = inputs.length > 0;
  const allowNoInputsRun = !hasInputs && areCredentialsStored && showGenerate && currentUser?.id;
  const showInputsForm = hasInputs && !generatedExecution && showInputsAfterExecution;

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
                    retryExecution={() => retryRunWorkflow(msg.data as IAnswer[])}
                    showInputs={() => cloneExecutionAnswers(msg.data as IAnswer[])}
                    saveAsDocument={() => saveGPTDocument(msg.data as IWorkflowCreateResponse, msg.text)}
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
                onGenerate={executeWorkflow}
                message={createMessage({
                  type: "form",
                  noHeader: true,
                })}
                isExecuting={gptGenerationStatus === "started"}
                disableGenerateBtn={gptGenerationStatus !== "pending"}
                progressBarButton
              />
            </Box>
          )}

          {allowNoInputsRun && (
            <Stack
              alignItems={"start"}
              justifyContent={"start"}
            >
              <RunButtonWithProgressBar
                loading={gptGenerationStatus === "started"}
                disabled={gptGenerationStatus !== "pending"}
                onClick={executeWorkflow}
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
