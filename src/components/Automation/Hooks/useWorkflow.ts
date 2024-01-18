import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useCreateUserWorkflowMutation, useGetWorkflowByIdQuery } from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setGeneratedExecution, setRepeatedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { setAnswers, setInputs } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import type { Category } from "@/core/api/dto/templates";
import type { INode, IWorkflow } from "@/common/types/workflow";

const useWorkflow = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workflowId = router.query?.id as string;

  const [workflowData, setWorkflowData] = useState<IWorkflow>();
  const { answers, inputs } = useAppSelector(state => state.chat);

  const {
    data,
    error,
    isLoading: isWorkflowLoading,
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

  const createWorkflowIfNeeded = async (selectedWorkflowId: number) => {
    let storedWorkflows = Storage.get("workflows") || {};

    if (!(selectedWorkflowId.toString() in storedWorkflows)) {
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

    let webhookPath = storedWorkflows[workflowData?.id!];

    const response = await ApiClient.post(`/webhook/${webhookPath}`, inputsData);

    return response.data;
  }

  useEffect(() => {
    if (data) {
      clearStoredStates();
      setWorkflowData(data);
      createWorkflowIfNeeded(data.id);
    }
  }, [data]);

  const workflowAsTemplate = {
    id: workflowData?.id,
    title: workflowData?.name,
    description: workflowData?.description!,
    created_at: workflowData?.created_at,
    thumbnail: workflowData?.image!,
    created_by: workflowData?.created_by,
    category: {} as Category,
    tags: [],
    prompts: [],
  };

  return {
    selectedWorkflow: workflowData,
    workflowAsTemplate,
    isWorkflowLoading,
    error,
    sendMessageAPI,
  };
};

export default useWorkflow;
