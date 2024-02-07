import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { useCreateUserWorkflowMutation, useGetWorkflowByIdQuery } from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearExecutionsStates } from "@/core/store/executionsSlice";
import { clearChatStates, setCredentials } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import { attachCredentialsToNode, extractCredentialsData, extractWebhookPath } from "@/components/Automation/helpers";
import type { Category } from "@/core/api/dto/templates";
import type { INode, IWorkflow } from "@/components/Automation/types";

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

  const createWorkflowIfNeeded = async (selectedWorkflowId: number) => {
    const storedWorkflows = Storage.get("workflows") || {};
    if (selectedWorkflowId.toString() in storedWorkflows) return;

    try {
      const response = await createWorkflow(selectedWorkflowId).unwrap();

      if (response) {
        webhookPathRef.current = extractWebhookPath(response.nodes);

        const nodesRequiringAuthentication = response.nodes.filter(node => node.parameters?.authentication);

        if (nodesRequiringAuthentication.length) {
          const storedCredentials = Storage.get("credentials") || {};

          nodesRequiringAuthentication.forEach(node => {
            attachCredentialsToNode(node, storedCredentials);
          });

          const updatedResponse = {
            name: response.name,
            nodes: response.nodes,
            active: response.active,
            connections: response.connections,
            settings: response.settings,
          };

          storedWorkflows[selectedWorkflowId] = {
            webhookPath: webhookPathRef.current,
            workflow: updatedResponse,
          };
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

  async function sendMessageAPI(): Promise<any> {
    let inputsData: Record<string, string> = {};

    inputs.forEach(input => {
      const answer = answers.find(answer => answer.inputName === input.name);
      inputsData[input.name] = answer?.answer as string;
    });

    const response = await ApiClient.post(`/webhook/${webhookPathRef.current}`, inputsData);
    return response.data;
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

  useEffect(() => {
    if (!workflow && data) {
      setWorkflowData(data);
    }
  }, [data]);

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
    selectedWorkflow: workflowData,
    isWorkflowLoading,
    workflowAsTemplate,
    sendMessageAPI,
    extractCredsFromNodes,
    createWorkflowIfNeeded,
  };
};

export default useWorkflow;
