import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";

import { Layout } from "@/layout";
import { ChatInterface } from "@/components/Prompt/Common/Chat/ChatInterface";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import SigninButton from "@/components/common/buttons/SigninButton";
import useChat from "@/components/Prompt/Hooks/useChat";
import { setInputs } from "@/core/store/chatSlice";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import WorkflowPlaceholder from "@/components/Automation/WorkflowPlaceholder";
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import type { IMessage } from "@/components/Prompt/Types/chat";
import type { Credentials } from "@/components/Automation/types";

export default function SingleWorkflow() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const {
    selectedWorkflow,
    isWorkflowLoading,
    workflowAsTemplate,
    sendMessageAPI,
    createWorkflowIfNeeded,
    getCredentials,
  } = useWorkflow();

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

  function prepareAndQueueMessages(credentials: Credentials[]) {
    const formMessage = createMessage({ type: "form", noHeader: true });
    const initialQueuedMessages: IMessage[] = [formMessage];

    if (credentials.length) {
      const credMessage = createMessage({ type: "credentials", noHeader: true });
      initialQueuedMessages.unshift(credMessage);
    }

    addToQueuedMessages(initialQueuedMessages);
  }

  useEffect(() => {
    const fetchAndProcessData = async () => {
      if (!isWorkflowLoading && selectedWorkflow?.data) {
        createWorkflowIfNeeded(selectedWorkflow.id);

        const { nodes } = selectedWorkflow.data;
        const credentials = await getCredentials(nodes);

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

    fetchAndProcessData();
  }, [selectedWorkflow, isWorkflowLoading]);

  const executeWorflow = async () => {
    try {
      setIsValidatingAnswer(true);
      const response = await sendMessageAPI();
      if (response && typeof response === "string") {
        messageAnswersForm(response, "html");
      }
    } catch (error) {
      messageAnswersForm("Something went wrong when executing this workflow.");
      console.error(error);
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
            height: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Stack
            height={"calc(100% - 20px)"}
            justifyContent={"flex-end"}
          >
            <ChatInterface
              template={workflowAsTemplate as unknown as Templates}
              messages={messages}
              showGenerate={showGenerate}
              onGenerate={executeWorflow}
            />
          </Stack>

          {currentUser?.id ? (
            <ChatInput
              onSubmit={validateVary}
              disabled={isValidatingAnswer}
              isValidating={isValidatingAnswer}
              showGenerate={showGenerateButton}
              onGenerate={executeWorflow}
            />
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
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
