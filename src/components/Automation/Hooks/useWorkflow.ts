import { useEffect } from "react";
import { useRouter } from "next/router";

import { useCreateUserWorkflowMutation } from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearExecutionsStates } from "@/core/store/executionsSlice";
import { clearChatStates, setCredentials } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import { attachCredentialsToNode, extractCredentialsData, extractWebhookPath } from "@/components/Automation/helpers";
import type { Category } from "@/core/api/dto/templates";
import type { INode, IWorkflow } from "@/components/Automation/types";

const useWorkflow = (workflow: IWorkflow) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workflowId = router.query?.workflowId as string;

  const { answers, inputs } = useAppSelector(state => state.chat);

  const [createWorkflow] = useCreateUserWorkflowMutation();

  const createWorkflowIfNeeded = async (selectedWorkflowId: number) => {
    const storedWorkflows = Storage.get("workflows") || {};
    const storedCredentials = Storage.get("credentials") || {};

    if (selectedWorkflowId.toString() in storedWorkflows) return;

    try {
      const response = await createWorkflow(selectedWorkflowId).unwrap();
      const webhookPath = extractWebhookPath(response.nodes);

      if (response) {
        const updatedResponse = {
          name: response.name,
          nodes: response.nodes,
          active: response.active,
          connections: response.connections,
          settings: response.settings,
        };

        updatedResponse.nodes.forEach(node => {
          attachCredentialsToNode(node, storedCredentials);
        });

        storedWorkflows[selectedWorkflowId] = {
          webhookPath,
          workflow: updatedResponse,
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

    const webhookPath = storedWorkflows[workflowId].webhookPath;
    try {
      const response = await ApiClient.post(`/webhook/${webhookPath}`, inputsData);
      return response.data;
    } catch (error) {
      console.error("failed to sendMessage");
    }
  }

  async function extractCredsFromNodes(nodes: INode[]) {
    const credentials = await extractCredentialsData(nodes);
    dispatch(setCredentials(credentials));
    return credentials;
  }
  useEffect(() => {
    dispatch(clearChatStates());
    dispatch(clearExecutionsStates());
  }, []);

  const workflowAsTemplate = {
    id: workflow?.id,
    title: workflow?.name,
    description: workflow?.description!,
    created_at: workflow?.created_at,
    thumbnail: workflow?.image!,
    created_by: workflow?.created_by,
    category: {} as Category,
    tags: [],
    prompts: [],
  };

  return {
    selectedWorkflow: workflow,
    workflowAsTemplate,
    sendMessageAPI,
    extractCredsFromNodes,
    createWorkflowIfNeeded,
  };
};

export default useWorkflow;
