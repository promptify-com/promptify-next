import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useCreateUserWorkflowMutation, useGetWorkflowByIdQuery } from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearExecutionsStates } from "@/core/store/executionsSlice";
import { clearChatStates, setCredentials } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import Storage from "@/common/storage";
import { attachCredentialsToNode, extractCredentialsData, extractWebhookPath } from "@/components/Automation/helpers";
import type { Category } from "@/core/api/dto/templates";
import type { INode, IWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";

const useWorkflow = (workflow: IWorkflow) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workflowId = router.query?.workflowId as string;

  const [workflowData, setWorkflowData] = useState<IWorkflow>(workflow);
  const { answers, inputs } = useAppSelector(state => state.chat);

  const {
    data,
    error,
    isLoading: isWorkflowLoading,
  } = useGetWorkflowByIdQuery(parseInt(workflowId), { skip: Boolean(workflow.id || !workflowId) });

  const [createWorkflow] = useCreateUserWorkflowMutation();

  const createWorkflowIfNeeded = async (selectedWorkflowId: number) => {
    const storedWorkflows = Storage.get("workflows") || {};

    if (selectedWorkflowId.toString() in storedWorkflows) return;

    try {
      const response = await createWorkflow(selectedWorkflowId).unwrap();
      if (response) {
        const mutableResponse = JSON.parse(JSON.stringify(response)) as IWorkflowCreateResponse;

        const webhookPath = extractWebhookPath(response.nodes);
        const storedCredentials = Storage.get("credentials") || {};

        mutableResponse.nodes.map(node => {
          attachCredentialsToNode(node, storedCredentials);
          return node;
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

    const webhookPath = storedWorkflows[workflowData?.id!];

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
