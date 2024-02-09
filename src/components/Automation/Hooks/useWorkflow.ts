import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import {
  useCreateUserWorkflowMutation,
  useGetWorkflowByIdQuery,
  useUpdateWorkflowMutation,
} from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearExecutionsStates } from "@/core/store/executionsSlice";
import { clearChatStates, setAreCredentialsStored } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import { attachCredentialsToNode, extractWebhookPath } from "@/components/Automation/helpers";
import type { Category } from "@/core/api/dto/templates";
import type { IStoredWorkflows, IWorkflow } from "@/components/Automation/types";

const useWorkflow = (workflow: IWorkflow) => {
  const router = useRouter();
  const workflowId = router.query?.workflowId as string;

  const { data, isLoading: isWorkflowLoading } = useGetWorkflowByIdQuery(parseInt(workflowId), {
    skip: Boolean(workflow.id || !workflowId),
  });

  const [workflowData, setWorkflowData] = useState<IWorkflow>(workflow);

  const dispatch = useAppDispatch();
  const webhookPathRef = useRef<string>();

  const { answers, inputs } = useAppSelector(state => state.chat);
  const [createWorkflow] = useCreateUserWorkflowMutation();
  const [updateWorkflow] = useUpdateWorkflowMutation();

  const createWorkflowIfNeeded = async (selectedWorkflowId: number) => {
    const storedWorkflows = Storage.get("workflows") || {};
    if (selectedWorkflowId.toString() in storedWorkflows) return;

    try {
      const response = await createWorkflow(selectedWorkflowId).unwrap();

      if (response) {
        webhookPathRef.current = extractWebhookPath(response.nodes);

        const nodesRequiringAuthentication = response.nodes.filter(
          node => node.parameters?.authentication && !node.credentials,
        );

        if (nodesRequiringAuthentication.length) {
          // response's objects are not extensible, so we need to extract the nodes
          const updatedNodes = response.nodes.map(node => ({ ...node }));
          updatedNodes.forEach(node => attachCredentialsToNode(node));

          const updatedResponse = {
            name: response.name,
            nodes: updatedNodes,
            active: response.active,
            connections: response.connections,
            settings: response.settings,
          };

          storedWorkflows[selectedWorkflowId] = {
            webhookPath: webhookPathRef.current,
          };

          if (updatedNodes.filter(node => node.parameters.authentication).every(node => node.credentials)) {
            dispatch(setAreCredentialsStored(true));

            try {
              await updateWorkflow({
                workflowId: parseInt(workflowId),
                data: updatedResponse,
              });
            } catch (error) {
              console.error("Error updating workflow:", error);
            }
          } else {
            dispatch(setAreCredentialsStored(false));
            storedWorkflows[selectedWorkflowId].workflow = updatedResponse;
          }
        } else {
          storedWorkflows[selectedWorkflowId] = {
            webhookPath: webhookPathRef.current,
          };
        }

        Storage.set("workflows", JSON.stringify(storedWorkflows));
      }
    } catch (error) {
      console.error("Error creating workflow:", error);
    }
  };

  async function removeWorkflowFromStorage(storedWorkflows: IStoredWorkflows = {}) {
    const _storedWorkflows = Object.values(storedWorkflows)?.length
      ? storedWorkflows
      : ((Storage.get("workflows") || {}) as IStoredWorkflows);
    const { workflow, webhookPath } = _storedWorkflows[workflowId];

    if (workflow) {
      storedWorkflows[workflowId] = { webhookPath };
      Storage.set("workflows", JSON.stringify(storedWorkflows));
    }
  }

  async function sendMessageAPI(): Promise<any> {
    let inputsData: Record<string, string> = {};

    if (!webhookPathRef.current) {
      const storedWorkflows = Storage.get("workflows") || {};
      webhookPathRef.current = storedWorkflows[workflowId].webhookPath;
      removeWorkflowFromStorage(storedWorkflows);
    } else {
      removeWorkflowFromStorage();
    }

    inputs.forEach(input => {
      const answer = answers.find(answer => answer.inputName === input.name);
      inputsData[input.name] = answer?.answer as string;
    });

    const response = await ApiClient.post(`/webhook/${webhookPathRef.current}`, inputsData);
    return response.data;
  }

  useEffect(() => {
    dispatch(clearChatStates());
    dispatch(clearExecutionsStates());
  }, []);

  useEffect(() => {
    if (!workflow && data) {
      setWorkflowData(data);
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
    isWorkflowLoading,
    workflowAsTemplate,
    sendMessageAPI,
    createWorkflowIfNeeded,
  };
};

export default useWorkflow;
