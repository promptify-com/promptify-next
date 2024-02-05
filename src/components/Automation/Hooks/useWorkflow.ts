import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  useCreateUserWorkflowMutation,
  useGetWorkflowByIdQuery,
  useUpdateWorkflowMutation,
} from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearExecutionsStates } from "@/core/store/executionsSlice";
import { clearChatStates, setCredentials } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import { attachCredentialsToNode, extractCredentialsData, extractWebhookPath } from "@/components/Automation/helpers";
import type { Category } from "@/core/api/dto/templates";
import type { ICredentials, INode, IWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";

const useWorkflow = (workflow: IWorkflow) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workflowId = router.query?.workflowId as string;

  const [workflowData, setWorkflowData] = useState<IWorkflow>(workflow);
  const { answers, inputs, areCredentialsStored } = useAppSelector(state => state.chat);

  const {
    data,
    error,
    isLoading: isWorkflowLoading,
  } = useGetWorkflowByIdQuery(parseInt(workflowId), { skip: Boolean(workflow.id || !workflowId) });

  const [createWorkflow] = useCreateUserWorkflowMutation();
  const [updateWorkflow] = useUpdateWorkflowMutation();
  const storedCredentials = Storage.get("credentials") || {};

  const updateWorkflowsWithCredentials = async () => {
    const storedWorkflows = Storage.get("workflows") || {};

    const workflow = storedWorkflows[workflowId].workflow as IWorkflowCreateResponse;

    const hasCredentials = (node: INode) => {
      return node.credentials && Object.keys(node.credentials).length > 0;
    };

    const nodesWithAuthentication = workflow.nodes.filter(node => node.parameters?.authentication);

    const allNodesHaveCredentials = nodesWithAuthentication.every(node => hasCredentials(node));

    if (allNodesHaveCredentials) {
      try {
        await updateWorkflow({
          workflowId: parseInt(workflowId),
          data: workflow,
        }).unwrap();
      } catch (error) {
        console.error("Error updating workflow:", error);
      }
    }
  };

  useEffect(() => {
    if (!areCredentialsStored) {
      return;
    }
    const attachCredentialsToStoredWorkflow = async () => {
      const storedWorkflows = Storage.get("workflows") || {};

      if (!storedWorkflows[workflowId]) {
        return;
      }
      const { workflow }: { workflow: IWorkflowCreateResponse } = storedWorkflows[workflowId];

      if (workflow?.nodes) {
        workflow.nodes.forEach(node => {
          attachCredentialsToNode(node, storedCredentials);
        });
        Storage.set("workflows", JSON.stringify(storedWorkflows));
        updateWorkflowsWithCredentials();
      }
    };
    attachCredentialsToStoredWorkflow();
  }, [JSON.stringify(storedCredentials)]);

  const createWorkflowIfNeeded = async (selectedWorkflowId: number) => {
    const storedWorkflows = Storage.get("workflows") || {};

    if (selectedWorkflowId.toString() in storedWorkflows) return;

    try {
      const response = await createWorkflow(selectedWorkflowId).unwrap();
      if (response) {
        const updatedResponse = {
          name: response.name,
          nodes: response.nodes,
          active: response.active,
          connections: response.connections,
          settings: response.settings,
        };
        const mutableResponse = JSON.parse(JSON.stringify(updatedResponse)) as IWorkflowCreateResponse;

        const webhookPath = extractWebhookPath(response.nodes);
        const storedCredentials = Storage.get("credentials") || {};

        mutableResponse.nodes.forEach(node => {
          attachCredentialsToNode(node, storedCredentials);
        });
        storedWorkflows[selectedWorkflowId] = {
          webhookPath,
          workflow: mutableResponse,
        };
        Storage.set("workflows", JSON.stringify(storedWorkflows));
      }
    } catch (error) {
      console.error("Error creating workflow:", error);
    }
  };

  async function sendMessageAPI(): Promise<any> {
    let inputsData: Record<string, string> = {};

    inputs.forEach(input => {
      const answer = answers.find(answer => answer.inputName === input.name);
      inputsData[input.name] = answer?.answer as string;
    });
    const storedWorkflows = Storage.get("workflows") || {};

    const webhookPath = storedWorkflows[workflowData?.id!].webhookPath;

    const response = await ApiClient.post(`/webhook/${webhookPath}`, inputsData);

    return response.data;
  }

  async function getCredentials(nodes: INode[]) {
    const credentials = await extractCredentialsData(nodes);
    dispatch(setCredentials(credentials));
    return credentials;
  }
  useEffect(() => {
    dispatch(clearChatStates());
    dispatch(clearExecutionsStates());
  }, []);

  useEffect(() => {
    if (data) {
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
    workflowAsTemplate,
    isWorkflowLoading,
    error,
    sendMessageAPI,
    getCredentials,
    createWorkflowIfNeeded,
  };
};

export default useWorkflow;
