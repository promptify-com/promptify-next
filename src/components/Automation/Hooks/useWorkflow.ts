import { useEffect } from "react";
import { useRouter } from "next/router";

import { useCreateUserWorkflowMutation, useGetWorkflowByIdQuery } from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setSelectedWorkflow } from "@/core/store/workflowSlice";
import { setGeneratedExecution, setRepeatedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { setAnswers, setInputs } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import type { Category } from "@/core/api/dto/templates";
import type { INode } from "@/common/types/workflow";

const useWorkflow = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workflowId = router.query?.id as string;

  const selectedWorkflow = useAppSelector(state => state.workflow.selectedWorkflow);
  const { answers, inputs } = useAppSelector(state => state.chat);

  const {
    data,
    error,
    isLoading: isWorkFlowLoading,
  } = useGetWorkflowByIdQuery(parseInt(workflowId), { skip: !workflowId });

  const [createWorkflow] = useCreateUserWorkflowMutation();

  const clearStoredStates = () => {
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
    dispatch(setRepeatedExecution(null));
    dispatch(setInputs([]));
    dispatch(setAnswers([]));
  };

  const extractWebhookPath = (nodes: INode[]) => {
    const webhookNode = nodes.find(node => node.type === "n8n-nodes-base.webhook");
    return webhookNode?.parameters?.path;
  };

  const createWorkflowIfNeeded = async (selectedWorkflowId: number, nodes: INode[]) => {
    const currentWorkflowPath = extractWebhookPath(nodes);
    let storedWorkflows = Storage.get("workflows") || {};

    if (
      !(selectedWorkflowId.toString() in storedWorkflows) ||
      storedWorkflows[selectedWorkflowId] !== currentWorkflowPath
    ) {
      try {
        const response = await createWorkflow(selectedWorkflowId);
        if ("data" in response) {
          storedWorkflows[selectedWorkflowId] = extractWebhookPath(response.data.nodes);

          Storage.set("workflows", JSON.stringify(storedWorkflows));
        }
      } catch (error) {
        console.error("Error creating workflow:", error);
      }
    }
  };

  async function sendMessageAPI(): Promise<any> {
    let inputsData: Record<string, string> = {};

    inputs.forEach(input => {
      const answer = answers.find(answer => answer.inputName === input.name);
      inputsData[input.name] = answer?.answer as string;
    });
    let storedWorkflows = Storage.get("workflows") || {};

    let webhookPath = storedWorkflows[selectedWorkflow.id];

    const response = await ApiClient.post(`/webhook/${webhookPath}`, inputsData);

    return response.data;
  }

  useEffect(() => {
    if (data) {
      clearStoredStates();
      dispatch(setSelectedWorkflow(data));
      createWorkflowIfNeeded(data.id, data.data.nodes);
    }
  }, [data]);

  const workflowAsTemplate = {
    id: selectedWorkflow.id,
    title: selectedWorkflow.name,
    description: selectedWorkflow.description!,
    created_at: selectedWorkflow.created_at,
    thumbnail: selectedWorkflow.image!,
    created_by: selectedWorkflow.created_by,
    category: {} as Category,
    tags: [],
    prompts: [],
  };

  return {
    selectedWorkflow,
    workflowAsTemplate,
    isWorkFlowLoading,
    error,
    sendMessageAPI,
  };
};

export default useWorkflow;
