import { useEffect } from "react";
import { useRouter } from "next/router";

import { useCreateUserWorkflowMutation, useGetWorkflowByIdQuery } from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setSelectedWorkflow } from "@/core/store/workflowSlice";
import { setGeneratedExecution, setRepeatedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { setAnswers, setInputs } from "@/core/store/chatSlice";
import Storage from "@/common/storage";
import type { Category } from "@/core/api/dto/templates";
import type { INode } from "@/common/types/workflow";

const useWorkflow = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workflowId = router.query.id as string;

  const selectedWorkflow = useAppSelector(state => state.workflow.selectedWorkflow);

  const { data, error, isLoading: isWorkFlowLoading } = useGetWorkflowByIdQuery(parseInt(workflowId));
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
    const storedWorkflowId = parseInt(Storage.get("workflowId"));
    const storedWorkflowPath = Storage.get("workflowPath");
    const currentWorkflowPath = extractWebhookPath(nodes);

    if (storedWorkflowId !== selectedWorkflowId || storedWorkflowPath !== currentWorkflowPath) {
      try {
        const response = await createWorkflow(selectedWorkflowId);
        if ("data" in response) {
          Storage.set("workflowId", JSON.stringify(response.data.id));
          Storage.set("workflowPath", JSON.stringify(extractWebhookPath(response.data.data.nodes)));
        }
      } catch (error) {
        console.error("Error creating workflow:", error);
      }
    }
  };

  useEffect(() => {
    if (data) {
      clearStoredStates();
      dispatch(setSelectedWorkflow(data));
      createWorkflowIfNeeded(data.id, data.data.nodes);
    }
  }, [data]);

  //@ts-ignore
  const workflowAsTemplate: WorkFlowAsTemplate = {
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
  };
};

export default useWorkflow;
