import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import WorkflowPlaceholder from "@/components/Automation/WorkflowPlaceholder";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import { authClient } from "@/common/axios";
import type { IWorkflow } from "@/components/Automation/types";
import Header from "@/components/GPT/Header";
import Chat from "@/components/GPT/Chat";
import store from "@/core/store";
import chatSlice from "@/core/store/chatSlice";

interface Props {
  workflow: IWorkflow;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default function GPT({ workflow = {} as IWorkflow }: Props) {
  const { selectedWorkflow, isWorkflowLoading } = useWorkflow(workflow);

  useEffect(() => {
    if (!store) {
      return;
    }

    store.injectReducers([{ key: "chat", asyncReducer: chatSlice }]);
  }, [store]);

  return (
    <Layout>
      {isWorkflowLoading ? (
        <WorkflowPlaceholder />
      ) : (
        <Stack
          gap={1}
          sx={{
            bgcolor: "common.white",
          }}
        >
          <Header workflow={selectedWorkflow} />
          <Chat workflow={selectedWorkflow} />
        </Stack>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }: any) {
  const { slug } = params;
  try {
    const res = await authClient.get(`/api/n8n/workflow_by_slug/${slug}/`);
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
