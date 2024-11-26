import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import WorkflowPlaceholder from "@/components/Automation/WorkflowPlaceholder";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import { authClient } from "@/common/axios";
import chatSlice, {
  setAreCredentialsStored,
  setClonedWorkflow,
  setCredentialsInput,
  setGptGenerationStatus,
  setInputs,
  setRequireCredentials,
} from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import executionsSlice, { clearExecutionsStates } from "@/core/store/executionsSlice";
import Header from "@/components/GPT/Header";
import store from "@/core/store";
import Workflow from "@/components/GPTs/FlowData";
import useMessageManager from "@/components/GPT/Hooks/useMessageManager";
import type { ITemplateWorkflow } from "@/components/Automation/types";
import type { IPromptInput } from "@/common/types/prompt";
import { isValidUserFn } from "@/core/store/userSlice";
import { useRouter } from "next/router";
import templatesSlice from "@/core/store/templatesSlice";
import ChatInterface from "@/components/GPT/Chat/ChatInterface";
import { extractCredentialsInput, oAuthTypeMapping } from "@/components/Automation/helpers";

interface Props {
  workflow: ITemplateWorkflow;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default function GPT({ workflow = {} as ITemplateWorkflow }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isValidUser = useAppSelector(isValidUserFn);

  const { selectedWorkflow, isWorkflowLoading, createWorkflowIfNeeded } = useWorkflow(workflow);
  const { extractCredentialsInputFromNodes } = useCredentials();

  const { prepareAndQueueMessages } = useMessageManager({
    initialMessageTitle: `${selectedWorkflow?.name}`,
  });

  const processData = async () => {
    if (!isValidUser) return;

    createWorkflowIfNeeded(selectedWorkflow.id)
      .then(async createdWorkflow => {
        if (!createdWorkflow) {
          return;
        }
        const { nodes } = createdWorkflow;

        const credentialsInput = await extractCredentialsInput(selectedWorkflow.data.nodes);
        dispatch(setCredentialsInput(credentialsInput));

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

        prepareAndQueueMessages(credentialsInput, nodes);
      })
      .catch(error => {
        console.error("Error handling the workflow creation:", error);
      });
  };

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(clearExecutionsStates());
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, dispatch]);

  useEffect(() => {
    processData();
    return () => {
      dispatch(setClonedWorkflow(undefined));
      dispatch(setGptGenerationStatus("pending"));
    };
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidUser]);

  useEffect(() => {
    if (!store) {
      return;
    }

    store.injectReducers([{ key: "chat", asyncReducer: chatSlice }]);
    store.injectReducers([{ key: "executions", asyncReducer: executionsSlice }]);
    store.injectReducers([{ key: "templates", asyncReducer: templatesSlice }]);
    // TODO: eslint warning blocked a commit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  return (
    <Layout>
      {isWorkflowLoading ? (
        <WorkflowPlaceholder />
      ) : (
        <Stack
          py={{ xs: 9, md: 0 }}
          sx={{
            bgcolor: "common.white",
          }}
          minHeight={"50svh"}
        >
          <Header workflow={selectedWorkflow} />
          <Stack
            pb={1.5}
            direction={{ xs: "column-reverse", md: "row" }}
            justifyContent={"space-between"}
          >
            <ChatInterface workflow={selectedWorkflow} />

            <Workflow workflow={selectedWorkflow} />
          </Stack>
        </Stack>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }: any) {
  const { slug } = params;
  try {
    const res = await authClient.get(`/api/n8n/workflows/by-slug/${slug}/`);
    const workflow: ITemplateWorkflow = res.data;

    return {
      props: {
        title: workflow.name ?? "AI App",
        description: workflow.description ?? AUTOMATION_DESCRIPTION,
        image: workflow.image,
        workflow,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "AI App",
        description: AUTOMATION_DESCRIPTION,
        workflow: {},
      },
    };
  }
}
