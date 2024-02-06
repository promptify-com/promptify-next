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
import WorkflowPlaceholder from "@/components/Automation/WorkflowPlaceholder";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import { authClient } from "@/common/axios";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { ICredential, IWorkflow } from "@/components/Automation/types";
import { checkAllCredsStored } from "@/components/Automation/helpers";

interface Props {
  workflow: IWorkflow;
}

export default function SingleWorkflow({ workflow }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { areCredentialsStored } = useAppSelector(state => state.chat);

  const {
    selectedWorkflow,
    workflowAsTemplate,
    sendMessageAPI,
    createWorkflowIfNeeded,
    extractCredsFromNodes,
    isWorkflowLoading,
  } = useWorkflow(workflow);

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

  const processData = async () => {
    if (selectedWorkflow?.data) {
      createWorkflowIfNeeded(selectedWorkflow.id);

      const { nodes } = selectedWorkflow.data;
      const credentials = await extractCredsFromNodes(nodes);

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
      prepareAndQueueMessages(credentials);
    }
  };

  useEffect(() => {
    processData();
  }, [selectedWorkflow]);

  function prepareAndQueueMessages(credentials: ICredential[]) {
    const formMessage = createMessage({ type: "form", noHeader: true });
    const initialQueuedMessages: IMessage[] = [formMessage];

    const areAllCredentialsStored = checkAllCredsStored(credentials);
    dispatch(setAreCredentialsStored(areAllCredentialsStored));

    if (!areAllCredentialsStored) {
      const credMessage = createMessage({ type: "credentials", noHeader: true });
      initialQueuedMessages.unshift(credMessage);
    }
    addToQueuedMessages(initialQueuedMessages);
  }

  const executeWorkflow = async () => {
    try {
      setIsValidatingAnswer(true);
      const response = await sendMessageAPI();
      if (response && typeof response === "string") {
        messageAnswersForm(response, "html");
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
          >
            <ChatInterface
              template={workflowAsTemplate as unknown as Templates}
              messages={messages}
              showGenerate={showGenerate}
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
