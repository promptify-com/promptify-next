import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  useCreateUserWorkflowMutation,
  useGetWorkflowBySlugQuery,
  useUpdateWorkflowMutation,
} from "@/core/api/workflows";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAreCredentialsStored, initialState as initialChatState, setClonedWorkflow } from "@/core/store/chatSlice";
import { n8nClient as ApiClient } from "@/common/axios";
import { attachCredentialsToNode, extractWebhookPath, oAuthTypeMapping } from "@/components/Automation/helpers";
import type { Category } from "@/core/api/dto/templates";
import type { ITemplateWorkflow, IWorkflowCreateResponse } from "@/components/Automation/types";
import { isValidUserFn } from "@/core/store/userSlice";
import { IAnswer } from "@/components/Prompt/Types/chat";

const useWorkflow = (workflow: ITemplateWorkflow) => {
  const router = useRouter();
  const isValidUser = useAppSelector(isValidUserFn);
  const workflowSlug = router.query?.slug as string;
  const { data, isLoading: isWorkflowLoading } = useGetWorkflowBySlugQuery(workflowSlug, {
    skip: Boolean(workflow.slug || !workflowSlug || !isValidUser),
  });

  const [workflowData, setWorkflowData] = useState<ITemplateWorkflow>(workflow);

  const dispatch = useAppDispatch();
  const webhookPathRef = useRef<string>();

  const { answers = [], inputs = [] } = useAppSelector(state => state.chat ?? initialChatState);
  const [createWorkflow] = useCreateUserWorkflowMutation();
  const [updateWorkflow] = useUpdateWorkflowMutation();

  const createWorkflowIfNeeded = async (selectedWorkflowId: number) => {
    let createdWorkflow: IWorkflowCreateResponse | undefined;

    try {
      createdWorkflow = await createWorkflow(selectedWorkflowId).unwrap();

      if (createdWorkflow) {
        webhookPathRef.current = extractWebhookPath(createdWorkflow.nodes);

        if (!webhookPathRef.current) {
          return;
        }

        const nodesRequiringAuthentication = createdWorkflow.nodes.filter(
          node => (node.parameters?.authentication || oAuthTypeMapping[node.type]) && !node.credentials,
        );

        if (nodesRequiringAuthentication.length) {
          const updatedWorkflow = structuredClone(createdWorkflow);

          updatedWorkflow.nodes.forEach(node => attachCredentialsToNode(node));

          const areAllCredentialsAttached = updatedWorkflow.nodes
            .filter(node => {
              return node.parameters.authentication || oAuthTypeMapping[node.type];
            })
            .every(node => node.credentials);

          // if at least one credential was attached to a node, then we need to update the workflow
          if (
            updatedWorkflow.nodes.some(
              node =>
                node.credentials && !["n8n-nodes-base.openAi", "n8n-nodes-promptify.promptify"].includes(node.type),
            )
          ) {
            try {
              updateWorkflow({
                workflowId: updatedWorkflow.id,
                data: updatedWorkflow,
              });
            } catch (error) {
              console.error("Error updating workflow:", error);
            }
          }

          if (areAllCredentialsAttached) {
            dispatch(setAreCredentialsStored(true));
          } else {
            dispatch(setAreCredentialsStored(false));
          }
        }
      }
    } catch (error) {
      createdWorkflow = undefined;
      console.error("Error creating workflow:", error);
    } finally {
      dispatch(setClonedWorkflow(createdWorkflow));
    }

    return createdWorkflow;
  };

  async function sendMessageAPI(webhook?: string, givenAnswers?: IAnswer[]): Promise<any> {
    let inputsData: Record<string, string> = {};

    inputs.forEach(input => {
      const answer = [...(givenAnswers ?? answers)].find(answer => answer.inputName === input.name);
      inputsData[input.name] = answer?.answer as string;
    });

    const response = await ApiClient.post(`/webhook/${webhook ?? webhookPathRef.current}`, inputsData);
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
