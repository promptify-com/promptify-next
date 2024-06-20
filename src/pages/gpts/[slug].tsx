import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import useWorkflow from "@/components/Automation/Hooks/useWorkflow";
import WorkflowPlaceholder from "@/components/Automation/WorkflowPlaceholder";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import { authClient } from "@/common/axios";
import chatSlice, { setClonedWorkflow, setInputs } from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { N8N_RESPONSE_REGEX } from "@/components/Automation/helpers";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { setToast } from "@/core/store/toastSlice";
import { EXECUTE_ERROR_TOAST } from "@/components/Prompt/Constants";
import executionsSlice, { setGeneratedExecution } from "@/core/store/executionsSlice";
import Header from "@/components/GPT/Header";
import store from "@/core/store";
import Workflow from "@/components/GPTs/FlowData";
import useMessageManager from "@/components/GPT/Hooks/useMessageManager";
import useGenerateExecution from "@/components/Prompt/Hooks/useGenerateExecution";
import NoScheduleGPTChat from "@/components/GPT/NoScheduleGPTChat";
import type { ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import type { IPromptInput, PromptLiveResponse } from "@/common/types/prompt";
import ScheduledChatSteps from "@/components/GPT/ScheduledChatSteps";
import { isValidUserFn } from "@/core/store/userSlice";
import SigninButton from "@/components/common/buttons/SigninButton";
import { useRouter } from "next/router";
import templatesSlice, { setGeneratingStatus } from "@/core/store/templatesSlice";
import { useUpdateWorkflowMutation } from "@/core/api/workflows";

interface Props {
  workflow: ITemplateWorkflow;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default function GPT({ workflow = {} as ITemplateWorkflow }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isValidUser = useAppSelector(isValidUserFn);
  const generatedExecution = useAppSelector(store => store.executions?.generatedExecution ?? undefined);
  const clonedWorkflow = useAppSelector(store => store.chat?.clonedWorkflow ?? undefined);

  const { selectedWorkflow, isWorkflowLoading, createWorkflowIfNeeded, sendMessageAPI } = useWorkflow(workflow);
  const { extractCredentialsInputFromNodes } = useCredentials();
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

  const {
    messages,
    showGenerate,
    prepareAndQueueMessages,
    messageWorkflowExecution,
    showGenerateButton: allowActivateButton,
  } = useMessageManager({
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

        prepareAndQueueMessages(credentialsInput, nodes);
      })
      .catch(error => {
        console.error("Error handling the workflow creation:", error);
      });
  };

  useEffect(() => {
    processData();

    return () => {
      dispatch(setClonedWorkflow(undefined));
    };
  }, [isValidUser]);

  useEffect(() => {
    if (!store) {
      return;
    }

    store.injectReducers([{ key: "chat", asyncReducer: chatSlice }]);
    store.injectReducers([{ key: "executions", asyncReducer: executionsSlice }]);
    store.injectReducers([{ key: "templates", asyncReducer: templatesSlice }]);
  }, [store]);

  const retryRunWorkflow = async (executionWorkflow: IWorkflowCreateResponse) => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    const { periodic_task: currentPeriodicTask } = clonedWorkflow;
    const { periodic_task: executionPeriodicTask } = executionWorkflow;
    const noInputsChange = currentPeriodicTask?.kwargs === executionPeriodicTask?.kwargs;

    const updatedWorkflow = noInputsChange ? executionWorkflow : await updateWorkflow(executionWorkflow);

    if (updatedWorkflow) {
      executeWorkflow();
      if (!noInputsChange) {
        updateWorkflow(structuredClone(clonedWorkflow));
      }
    }
  };

  const executeWorkflow = async () => {
    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }

    try {
      dispatch(setGeneratingStatus(true));

      const response = await sendMessageAPI();
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
          py={{ xs: 9, md: 0 }}
          sx={{
            bgcolor: "common.white",
          }}
          minHeight={"50svh"}
        >
          <Header workflow={selectedWorkflow} />
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            justifyContent={"space-between"}
          >
            {!isValidUser ? (
              <Stack
                flex={1}
                gap={8}
                sx={{
                  p: "48px",
                  height: "40px",
                }}
              >
                <SigninButton onClick={() => router.push("/signin")} />
              </Stack>
            ) : selectedWorkflow.is_schedulable ? (
              <ScheduledChatSteps
                workflow={selectedWorkflow}
                allowActivateButton={allowActivateButton}
              />
            ) : (
              <NoScheduleGPTChat
                workflow={workflow}
                messages={messages}
                showGenerate={showGenerate}
                onGenerate={executeWorkflow}
                retryRunWorkflow={retryRunWorkflow}
                processData={processData}
              />
            )}
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
