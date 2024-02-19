import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { Layout } from "@/layout";
import { ChatInterface } from "@/components/Prompt/Common/Chat/ChatInterface";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import SigninButton from "@/components/common/buttons/SigninButton";
import useChat from "@/components/Prompt/Hooks/useChat";
import { setAreCredentialsStored, setInputs } from "@/core/store/chatSlice";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import WorkflowPlaceholder from "@/components/Automation/WorkflowPlaceholder";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import { authClient } from "@/common/axios";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { ICredentialInput, INode, IWorkflow } from "@/components/Automation/types";
import { oAuthTypeMapping } from "@/components/Automation/helpers";
import useStreamExecution from "@/components/Automation/Hooks/useStreamExecution";
import { N8N_RESPONSE_REGEX } from "@/components/Automation/helpers";
import { ExecutionMessage } from "@/components/Automation/ExecutionMessage";

interface Props {
  workflow: IWorkflow;
}

export default function SingleWorkflow({ workflow = {} as IWorkflow }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { areCredentialsStored } = useAppSelector(state => state.chat);

  const { extractCredentialsInputFromNodes, checkAllCredentialsStored } = useCredentials();

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

  const { streamExecutionHandler } = useStreamExecution({ messageAnswersForm });

  const processData = async () => {
    if (selectedWorkflow?.data) {
      const { nodes } = selectedWorkflow.data;
      const credentialsInput = await extractCredentialsInputFromNodes(nodes);
      createWorkflowIfNeeded(selectedWorkflow.id);

      const inputs: IPromptInput[] = nodes
        .filter(node => node.type === "n8n-nodes-base.set")
        .flatMap(node => node.parameters.fields?.values || [])
        .map(value => ({
          name: value.name,
          fullName: value.name,
          type: "text",
          required: true,
        }));

      dispatch(setInputs(inputs));
      initialMessages({ questions: inputs });
      prepareAndQueueMessages(credentialsInput, nodes);
    }
  };

  useEffect(() => {
    if (isWorkflowLoading && !selectedWorkflow) {
      return;
    }
    processData();
  }, [selectedWorkflow, isWorkflowLoading]);

  function prepareAndQueueMessages(credentialsInput: ICredentialInput[], nodes: INode[]) {
    const initialQueuedMessages: IMessage[] = [];

    const requiresAuthentication = nodes.some(node => node.parameters?.authentication);
    const requiresOauth = nodes.some(node => oAuthTypeMapping[node.type!]);

    let areAllCredentialsStored = true;
    if (requiresAuthentication || requiresOauth) {
      areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);
    }

    dispatch(setAreCredentialsStored(false));

    if ((requiresAuthentication && !areAllCredentialsStored) || (requiresOauth && !areAllCredentialsStored)) {
      const credMessage = createMessage({ type: "credentials", noHeader: true });
      initialQueuedMessages.push(credMessage);
      const inputProv: IPromptInput[] = [
        {
          name: "credentials",
          fullName: "credentials",
          type: "credentials",
          required: true,
        },
      ];
      dispatch(setInputs(inputProv));
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
        const regex = new RegExp(N8N_RESPONSE_REGEX);
        if (regex.test(response)) {
          streamExecutionHandler(response);
        } else {
          messageAnswersForm(response, "html");
        }
      }
    } catch (error) {
      messageAnswersForm("Something went wrong when executing this GPT.");
    }
    setIsValidatingAnswer(false);
  };

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
              showGenerate={false}
              onGenerate={executeWorkflow}
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
  const { workflowId } = params;
  try {
    const res = await authClient.get(`/api/n8n/workflows/${workflowId}/`);
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
