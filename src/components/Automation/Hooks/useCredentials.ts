import { useState } from "react";
import Storage from "@/common/storage";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { workflowsApi, useUpdateWorkflowMutation } from "@/core/api/workflows";
import { extractCredentialsInput } from "@/components/Automation/helpers";
import {
  setCredentialsInput,
  initialState as initialChatState,
  setClonedWorkflow,
} from "@/core/store/chatSlice";
import type {
  ICredential,
  ICredentialInput,
  INode,
  INodeCredentials,
  IWorkflowCreateResponse,
} from "@/components/Automation/types";
import { useRouter } from "next/router";

const useCredentials = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workflowId = router.query.workflowId;
  const [credentials, setCredentials] = useState<ICredential[]>(
    (Storage.get("credentials") as unknown as ICredential[]) || [],
  );
  const { credentialsInput, clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [getCredentials] = workflowsApi.endpoints.getCredentials.useLazyQuery();
  const [getUserWorkflows] = workflowsApi.endpoints.getUserWorkflows.useLazyQuery();

  const initializeCredentials = (): Promise<ICredential[]> => {
    return new Promise(async resolve => {
      if (!!credentials.length || !currentUser?.id) {
        resolve(credentials);

        return;
      }

      try {
        const fetchedCredentials = await getCredentials().unwrap();

        if (!fetchedCredentials.length) {
          return;
        }

        setCredentials(fetchedCredentials);
        Storage.set("credentials", JSON.stringify(fetchedCredentials));
        resolve(fetchedCredentials);
      } catch (error) {
        console.error("Failed fetching Credentials");
        resolve(credentials);
      }
    });
  };
  const [getWorkflow] = workflowsApi.endpoints.getWorkflow.useLazyQuery();
  const [updateWorkflow] = useUpdateWorkflowMutation();

  async function extractCredentialsInputFromNodes(nodes: INode[]) {
    await initializeCredentials();
    const _credentialsInput = await extractCredentialsInput(nodes);
    dispatch(setCredentialsInput(_credentialsInput));
    return _credentialsInput;
  }

  const checkAllCredentialsStored = (credentialsInput: ICredentialInput[]) => {
    const _credentials = (Storage.get("credentials") || []) as ICredential[];

    if (!credentialsInput.length || !_credentials.length) {
      return false;
    }

    return credentialsInput.every(input => _credentials.some(credential => credential.type === input.name));
  };

  const checkCredentialInserted = (credential: ICredentialInput) => {
    const _credentials = (Storage.get("credentials") || []) as ICredential[];

    return _credentials.findIndex(c => c.type === credential?.name) !== -1;
  };

  const updateCredentials = (newCredential: ICredential) => {
    const updatedCredentials = (Storage.get("credentials") as unknown as ICredential[]) || [];

    updatedCredentials.push(newCredential);
    setCredentials(updatedCredentials);
    Storage.set("credentials", JSON.stringify(updatedCredentials));
  };

  const removeCredential = (credentialId: string) => {
    const _credentials = (Storage.get("credentials") || []) as ICredential[];
    const updatedCredentials = _credentials.filter(credential => credential.id !== credentialId);

    setCredentials(updatedCredentials);
    Storage.set("credentials", JSON.stringify(updatedCredentials));
  };

  function recreateNodeCredentials(nodeCredentials: INodeCredentials) {
    const _newCredentials = {} as INodeCredentials;

    for (const provider in nodeCredentials) {
      _newCredentials[provider] = { id: nodeCredentials[provider].id, name: nodeCredentials[provider].name };
    }

    return _newCredentials;
  }

  async function updateWorkflowAfterCredentialsDeletion(credentialType: string) {
    const { data: workflows } = await getUserWorkflows().unwrap();

    const currentWorkflow = workflows.find(workflow => clonedWorkflow?.id === workflow.id);

    const updatedNodes = currentWorkflow?.nodes.map(node => {
      if (node.credentials && node.credentials[credentialType]) {
        const updatedCredentials = { ...node.credentials };
        updatedCredentials[credentialType] = { ...updatedCredentials[credentialType], name: "to_be_deleted" };
        return {
          ...node,
          credentials: recreateNodeCredentials(updatedCredentials),
        };
      }
      return node;
    });

    const updatedWorkflow = { ...currentWorkflow, nodes: updatedNodes } as IWorkflowCreateResponse;

    if (updatedWorkflow.id && updatedNodes) {
      const updatedResponse = {
        id: updatedWorkflow.id,
        name: updatedWorkflow.name,
        nodes: updatedNodes,
        active: updatedWorkflow.active,
        connections: updatedWorkflow.connections,
        settings: updatedWorkflow.settings,
      };
      //@TODO: replace with real workflow id
      const response = await updateWorkflow({ workflowId: 11, data: updatedResponse }).unwrap();
      dispatch(setClonedWorkflow(response));
    }
  }

  return {
    credentials,
    setCredentials,
    checkCredentialInserted,
    initializeCredentials,
    checkAllCredentialsStored,
    updateCredentials,
    credentialsInput,
    extractCredentialsInputFromNodes,
    removeCredential,
    updateWorkflowAfterCredentialsDeletion,
  };
};

export default useCredentials;
