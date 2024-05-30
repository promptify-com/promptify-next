import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { Layout } from "@/layout";
import { ChatInterface } from "@/components/Automation/ChatInterface";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import SigninButton from "@/components/common/buttons/SigninButton";
import useChat from "@/components/Prompt/Hooks/useChat";
import chatSlice, { clearChatStates, setAreCredentialsStored, setInputs } from "@/core/store/chatSlice";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import WorkflowPlaceholder from "@/components/Automation/WorkflowPlaceholder";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import { authClient } from "@/common/axios";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { ICredentialInput, INode, IWorkflow } from "@/components/Automation/types";
import { oAuthTypeMapping, N8N_RESPONSE_REGEX } from "@/components/Automation/helpers";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import executionsSlice, { clearExecutionsStates, setGeneratedExecution } from "@/core/store/executionsSlice";
import { setToast } from "@/core/store/toastSlice";
import { EXECUTE_ERROR_TOAST } from "@/components/Prompt/Constants";
import store from "@/core/store";

interface Props {
  workflow: IWorkflow;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default function SingleWorkflow({ workflow = {} as IWorkflow }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const areCredentialsStored = useAppSelector(state => state.chat?.areCredentialsStored ?? false);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const { extractCredentialsInputFromNodes, checkAllCredentialsStored, initializeCredentials } = useCredentials();
  const { selectedWorkflow, workflowAsTemplate, sendMessageAPI, createWorkflowIfNeeded, isWorkflowLoading } =
    useWorkflow(workflow);
  const {
    messages,
    initialMessages,
    validateVary,
    isValidatingAnswer,
    showGenerate,
    showGenerateButton,
    setIsValidatingAnswer,
    messageAnswersForm,
    createMessage,
    addToQueuedMessages,
  } = useChat({
    initialMessageTitle: `${selectedWorkflow?.name}`,
  });
  const { streamExecutionHandler } = useGenerateExecution({
    messageAnswersForm,
  });
  const processData = async (skipInitialMessages: boolean = false) => {
    createWorkflowIfNeeded(selectedWorkflow.id)
      .then(async createdWorkflow => {
        if (!createdWorkflow) {
          return;
        }
        const { nodes } = createdWorkflow;

        const credentialsInput = await extractCredentialsInputFromNodes(nodes);

        const inputs: IPromptInput[] = nodes
          .filter(node => node.type === "n8n-nodes-base.set")
          .flatMap(node => node.parameters.fields?.values ?? node.parameters.assignments?.assignments ?? [])
          .map(value => ({
            name: value.name,
            fullName: value.name,
            type: "text",
            required: true,
          }));

        dispatch(setInputs(inputs));

        initialMessages({ questions: inputs });

        prepareAndQueueMessages(credentialsInput, nodes);
      })
      .catch(error => {
        console.error("Error handling the workflow creation:", error);
      });
  };

  useEffect(() => {
    initializeCredentials();
    dispatch(clearChatStates());
    dispatch(clearExecutionsStates());
  }, []);

  useEffect(() => {
    if (selectedWorkflow && !isWorkflowLoading) {
      processData();
    }
  }, [isWorkflowLoading, selectedWorkflow]);

  useEffect(() => {
    if (!store) {
      return;
    }

    store.injectReducers([
      { key: "chat", asyncReducer: chatSlice },
      { key: "executions", asyncReducer: executionsSlice },
    ]);
  }, [store]);

  function prepareAndQueueMessages(credentialsInput: ICredentialInput[], nodes: INode[]) {
    const initialQueuedMessages: IMessage[] = [];

    const requiresAuthentication = nodes.some(node => node.parameters?.authentication && !node.credentials);
    const requiresOauth = nodes.some(node => oAuthTypeMapping[node.type] && !node.credentials);

    let areAllCredentialsStored = true;
    if (requiresAuthentication || requiresOauth) {
      areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);
    }
    dispatch(setAreCredentialsStored(areAllCredentialsStored));

    if ((requiresAuthentication || requiresOauth) && !areAllCredentialsStored) {
      const credMessage = createMessage({ type: "credentials", noHeader: true });
      initialQueuedMessages.push(credMessage);
    }
    const formMessage = createMessage({ type: "form", noHeader: true });
    initialQueuedMessages.push(formMessage);

    addToQueuedMessages(initialQueuedMessages);
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
            messageAnswersForm(response, "html");
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

  const messageGeneratedExecution = (execution: PromptLiveResponse) => {
    const title = execution.temp_title;
    const promptsOutput = execution.data.map(data => data.message).join(" ");
    const output = title ? `# ${title}\n\n${promptsOutput}` : promptsOutput;
    messageAnswersForm(output, "html");
  };

  useEffect(() => {
    if (generatedExecution?.data?.length) {
      const allPromptsCompleted = generatedExecution.data.every(execData => execData.isCompleted);

      if (allPromptsCompleted) {
        messageGeneratedExecution(generatedExecution);
        dispatch(setGeneratedExecution(null));
      }
    }
  }, [generatedExecution]);

  return (
    <Layout>
      {isWorkflowLoading ? (
        <WorkflowPlaceholder />
      ) : (
        <Stack
          sx={{
            width: { md: "80%" },
            mx: { md: "auto" },
            height: { xs: "100vh", md: "calc(100vh - 120px)" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Stack
            height={{ xs: "calc(100% - 140px)", md: "calc(100% - 20px)" }}
            justifyContent={"flex-end"}
            overflow={"auto"}
          >
            <ChatInterface
              template={workflowAsTemplate as unknown as Templates}
              messages={messages}
              showGenerate={showGenerate}
              onGenerate={executeWorkflow}
              isValidating={isValidatingAnswer}
              processData={processData}
            />
          </Stack>

          {currentUser?.id ? (
            <Stack p={{ xs: "0px 0px 17px 0px", md: 0 }}>
              <ChatInput
                onSubmit={validateVary}
                disabled={isValidatingAnswer || !areCredentialsStored}
                isValidating={isValidatingAnswer}
                showGenerate={showGenerateButton}
                onGenerate={executeWorkflow}
              />
            </Stack>
          ) : (
            <Stack
              direction="row"
              justifyContent="center"
              p={{ md: "16px 8px 16px 16px" }}
              m={"auto"}
            >
              <SigninButton onClick={() => router.push("/signin")} />
            </Stack>
          )}
        </Stack>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }: any) {
  const { slug } = params;
  try {
    const res = await authClient.get(`/api/n8n/workflows/by-slug/${slug}/`);
    const workflow: IWorkflow = res.data;

    return {
      props: {
        title: workflow.name ?? "GPT",
        description: workflow.description ?? AUTOMATION_DESCRIPTION,
        image: workflow.image,
        workflow,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "GPT",
        description: AUTOMATION_DESCRIPTION,
        workflow: {},
      },
    };
  }
}
