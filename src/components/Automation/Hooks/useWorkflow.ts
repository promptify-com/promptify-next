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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

    try {
      createdWorkflow = await createWorkflow(selectedWorkflowId).unwrap();

      if (createdWorkflow) {
        webhookPathRef.current = extractWebhookPath(createdWorkflow.nodes);

        if (!webhookPathRef.current) {
          return;
        }

        const updatedWorkflow = structuredClone(createdWorkflow);

        updatedWorkflow.nodes = updatedWorkflow.nodes.map(node => {
          if (node.type === "n8n-nodes-promptify.promptify") {
            return {
              ...node,
              parameters: {
                ...node.parameters,
                base_url: baseUrl || "",
              },
            };
          }
          return node;
        });

        updatedWorkflow.nodes.forEach(node => attachCredentialsToNode(node));

        const areAllCredentialsAttached = updatedWorkflow.nodes
          .filter(node => node.parameters.authentication || oAuthTypeMapping[node.type])
          .every(node => node.credentials);

        try {
          const response = await updateWorkflow({
            workflowId: updatedWorkflow.id,
            data: updatedWorkflow,
          }).unwrap();

          dispatch(setClonedWorkflow(response));
        } catch (error) {
          console.error("Error updating workflow:", error);
        }

        dispatch(setAreCredentialsStored(areAllCredentialsAttached));
      }
    } catch (error) {
      createdWorkflow = undefined;
      console.error("Error creating workflow:", error);
    }

    return createdWorkflow;
  };

  async function sendMessageAPI(webhook?: string, givenAnswers?: IAnswer[], frequency?: string): Promise<any> {
    const inputsData: Record<string, string> = {};

    inputs.forEach(input => {
      const answer = [...(givenAnswers ?? answers)].find(answer => answer.inputName === input.name);
      inputsData[input.name] = answer?.answer as string;
    });

    const response = await ApiClient.post(
      `/webhook/${webhook ?? webhookPathRef.current}${frequency ? `?frequency=${frequency}` : ""}`,
      inputsData,
    );
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
