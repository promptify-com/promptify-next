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
import type { Templates } from "@/core/api/dto/templates";
import type { IPromptInput } from "@/common/types/prompt";
import WorkflowPlaceholder from "@/components/Automation/WorkflowPlaceholder";

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { selectedWorkflow, isWorkFlowLoading, workflowAsTemplate } = useWorkflow();

  const { messages, initialMessages, validateVary, isValidatingAnswer, showGenerate, showGenerateButton } = useChat({
    initialMessageTitle: selectedWorkflow.name,
  });

  useEffect(() => {
    if (!isWorkFlowLoading && selectedWorkflow && selectedWorkflow.data) {
      // Map the nodes to IPromptInput format
      const questions: IPromptInput[] = selectedWorkflow.data.nodes
        .filter(node => node.type === "n8n-nodes-base.set")
        .flatMap(node => node.parameters.fields?.values || [])
        .map(value => ({
          name: value.name,
          fullName: value.name,
          type: "text",
          required: true,
          defaultValue: "",
        }));

      initialMessages({ questions });
      dispatch(setInputs(questions));
    }
  }, [selectedWorkflow, isWorkFlowLoading]);

  return (
    <Layout>
      {isWorkFlowLoading ? (
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
              template={workflowAsTemplate as Templates}
              messages={messages}
              showGenerate={showGenerate}
              onGenerate={() => {}}
            />
          </Stack>

          {currentUser?.id ? (
            <ChatInput
              onSubmit={validateVary}
              disabled={false}
              isValidating={isValidatingAnswer}
              showGenerate={showGenerateButton}
              onGenerate={() => {}}
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
