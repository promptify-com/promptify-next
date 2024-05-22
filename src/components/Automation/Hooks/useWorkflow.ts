import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  useCreateUserWorkflowMutation,
  useGetWorkflowByslugQuery,
  useUpdateWorkflowMutation,
} from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAreCredentialsStored, setClonedWorkflow } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import { attachCredentialsToNode, extractWebhookPath, oAuthTypeMapping } from "@/components/Automation/helpers";
import type { Category } from "@/core/api/dto/templates";
import type { IWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";

const useWorkflow = (workflow: IWorkflow) => {
  const router = useRouter();
  const workflowSlug = router.query?.slug as string;
  const { data, isLoading: isWorkflowLoading } = useGetWorkflowByslugQuery(workflowSlug, {
    skip: Boolean(workflow.slug || !workflowSlug),
  });

  const [workflowData, setWorkflowData] = useState<IWorkflow>(workflow);

  const dispatch = useAppDispatch();
  const webhookPathRef = useRef<string>();

  const { answers, inputs } = useAppSelector(state => state.chat);
  const [createWorkflow] = useCreateUserWorkflowMutation();
  const [updateWorkflow] = useUpdateWorkflowMutation();

  const createWorkflowIfNeeded = async (selectedWorkflowId: number) => {
    let createdWorklow: IWorkflowCreateResponse | undefined;
    try {
      createdWorklow = await createWorkflow(selectedWorkflowId).unwrap();

      if (createdWorklow) {
        webhookPathRef.current = extractWebhookPath(createdWorklow.nodes);
        if (!webhookPathRef.current) {
          return;
        }
        const nodesRequiringAuthentication = createdWorklow.nodes.filter(
          node => (node.parameters?.authentication || oAuthTypeMapping[node.type]) && !node.credentials,
        );
        if (nodesRequiringAuthentication.length) {
          const updatedNodes = createdWorklow.nodes.map(node => ({ ...node }));
          updatedNodes.forEach(node => attachCredentialsToNode(node));

          const updatedResponse = {
            id: createdWorklow.id,
            name: createdWorklow.name,
            nodes: updatedNodes,
            active: createdWorklow.active,
            connections: createdWorklow.connections,
            settings: createdWorklow.settings,
          };

          const filteredNodes = updatedNodes
            .filter(node => {
              return node.parameters.authentication || oAuthTypeMapping[node.type];
            })
            .every(node => node.credentials);

          if (filteredNodes) {
            dispatch(setAreCredentialsStored(true));

            try {
              //TODO: Replace by current workflow id
              await updateWorkflow({
                workflowId: 11,
                data: updatedResponse,
              });
            } catch (error) {
              console.error("Error updating workflow:", error);
            }
          } else {
            dispatch(setAreCredentialsStored(false));
          }
        }
      }
    } catch (error) {
      createdWorklow = undefined;
      console.error("Error creating workflow:", error);
    }
    dispatch(setClonedWorkflow(createdWorklow));
    return createdWorklow;
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

  useEffect(() => {
    if (!workflow && data && !isWorkflowLoading) {
      setWorkflowData(data);
    }
  }, [data, isWorkflowLoading]);

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
