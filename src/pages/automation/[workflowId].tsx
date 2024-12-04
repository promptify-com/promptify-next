import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { Layout } from "@/layout";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import SigninButton from "@/components/common/buttons/SigninButton";
import { resetStates } from "@/core/store/chatSlice";

import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import { authClient } from "@/common/axios";

import useApp from "@/components/Automation/app/hooks/useApp";

import type { IWorkflow } from "@/components/Automation/types";
import useChat from "@/components/Automation/app/hooks/useChatApp";
import ChatInterface from "@/components/Automation/ChatInterface/index";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";

interface Props {
  workflow: IWorkflow;
}

export default function SingleWorkflow({ workflow = {} as IWorkflow }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { createApp, prepareInputs } = useApp();

  const { messages, runWorkflow, validatingQuery, handleSubmit, retryRunWorkflow } = useChat({
    appTitle: workflow.name,
  });

  useEffect(() => {
    if (workflow) {
      createApp(workflow.id);
      prepareInputs();
    }

    return () => {
      dispatch(resetStates());
    };
  }, [workflow]);

  return (
    <Layout>
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
            workflow={workflow}
            messages={messages}
            onGenerate={runWorkflow}
            validateQuery={validatingQuery}
            handleSubmit={handleSubmit}
            retryWorkflow={retryRunWorkflow}
          />
        </Stack>

        {currentUser?.id ? (
          <Stack p={{ xs: "0px 0px 17px 0px", md: 0 }}>
            <ChatInput
              onSubmit={handleSubmit}
              disabled={validatingQuery}
              isValidating={validatingQuery}
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
