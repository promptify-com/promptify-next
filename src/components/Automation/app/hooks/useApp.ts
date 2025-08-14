import { useRef, useState } from "react";

import { n8nClient } from "@/common/axios";
import { attachCredentialsToNode, extractWebhookPath, oAuthTypeMapping } from "@/components/Automation/app/helpers";
import type { INode, IWorkflowCreateResponse } from "@/components/Automation/types";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { RootState } from "@/core/store";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAreCredentialsStored, setCredentialsInput, setInputs, setSelectedApp } from "@/core/store/chatSlice";
import { IPromptInput } from "@/common/types/prompt";
import { IAnswer } from "@/components/Prompt/Types/chat";
import { useCreateUserWorkflowMutation, useUpdateWorkflowMutation } from "@/core/api/workflows";
import { IApp } from "@/components/Automation/app/hooks/types";

const useApp = () => {
  const [isDataPrepared, setIsDataPrepared] = useState(true);
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;
  const [createAppMutation] = useCreateUserWorkflowMutation();
  const [updateAppMutation] = useUpdateWorkflowMutation();
  const webhookPathRef = useRef<string>();

  const { inputs, answers, selectedApp } = useAppSelector((state: RootState) => state.chat);
  const dispatch = useAppDispatch();

  const { extractCredentialsInputFromNodes } = useCredentials();

  const addBaseUrlToPromptifyNodes = (nodes: INode[]): INode[] => {
    return nodes.map(node => {
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
  };

  const processNodeInputs = async (nodes: INode[]): Promise<INode[]> => {
    if (!nodes) return nodes;

    const credentialInputs = await extractCredentialsInputFromNodes(nodes);

    dispatch(setCredentialsInput(credentialInputs));

    const formattedInputs: IPromptInput[] = nodes
      .filter(node => node.type === "n8n-nodes-base.set")
      .flatMap(node => node.parameters.fields?.values ?? node.parameters.assignments?.assignments ?? [])
      .map(field => ({
        name: field.name,
        fullName: field.name,
        type: "text",
        required: true,
      }));
    dispatch(setInputs(formattedInputs));

    const requiresAuthNodes = nodes.filter(node => node.parameters.authentication || oAuthTypeMapping[node.type]);

    await Promise.all(
      requiresAuthNodes.map(async node => {
        if (!node.credentials) {
          attachCredentialsToNode(node);
        }
      }),
    );

    const credentialsAttached = requiresAuthNodes.every(
      node => node.credentials && Object.keys(node.credentials).length > 0,
    );

    dispatch(setAreCredentialsStored(credentialsAttached));

    return addBaseUrlToPromptifyNodes(nodes);
  };

  const prepareInputs = async () => {
    const nodes = selectedApp?.nodes;
    if (nodes) {
      await processNodeInputs(nodes as INode[]);
    }
  };

  const createApp = async (workflowId: number) => {
    let createdApp: IWorkflowCreateResponse | undefined;

    try {
      createdApp = await createAppMutation(workflowId).unwrap();

      if (createdApp) {
        webhookPathRef.current = extractWebhookPath(createdApp.nodes as INode[]);

        if (!webhookPathRef.current) {
          return;
        }

        const appCopy = structuredClone(createdApp);
        appCopy.nodes = await processNodeInputs(appCopy.nodes as INode[]);

        try {
          await updateAppMutation({
            workflowId: createdApp.id,
            data: {
              ...appCopy,
              active: true,
            },
          }).unwrap();
        } catch (error) {
          console.error("Error creating and updating app:", error);
        }
      }
    } catch (error) {
      console.error("Error creating and updating app:", error);
    } finally {
      if (createdApp) dispatch(setSelectedApp(createdApp as unknown as IApp));
      setIsDataPrepared(false);
    }
    return createdApp;
  };

  async function executeN8nApp(webhook?: string, providedAnswers?: IAnswer[], frequency?: string): Promise<any> {
    const inputPayload: Record<string, string> = {};

    inputs.forEach(input => {
      const answer = [...(providedAnswers ?? answers)].find(ans => ans.inputName === input.name);
      inputPayload[input.name] = answer?.answer as string;
    });

    const response = await n8nClient.post(
      `/webhook/${webhook ?? webhookPathRef.current}${frequency ? `?frequency=${frequency}` : ""}`,
      inputPayload,
    );
    return response.data;
  }

  return { executeN8nApp, createApp, prepareInputs, isDataPrepared };
};

export default useApp;
