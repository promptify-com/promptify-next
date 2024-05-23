import { useState } from "react";
import Storage from "@/common/storage";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { workflowsApi, useUpdateWorkflowMutation } from "@/core/api/workflows";
import { extractCredentialsInput } from "@/components/Automation/helpers";
import { setCredentialsInput, initialState as initialChatState, setClonedWorkflow } from "@/core/store/chatSlice";
import type { ICredential, ICredentialInput, INode } from "@/components/Automation/types";

const useCredentials = () => {
  const dispatch = useAppDispatch();
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

  async function updateWorkflowAfterCredentialsDeletion(credentialType: string, allWorkflows: boolean) {
    if (!allWorkflows) {
      if (!clonedWorkflow?.id) {
        return;
      }

      const _updatedWorkflow = structuredClone(clonedWorkflow);
      let credentialFound = false;
      _updatedWorkflow.nodes.forEach(node => {
        if (!node.credentials) {
          return;
        }

        if (!node.credentials[credentialType]) {
          return;
        }

        node.credentials[credentialType].name = "to_be_deleted";
        credentialFound = true;
      });

      if (credentialFound) {
        const response = await updateWorkflow({ workflowId: _updatedWorkflow.id, data: _updatedWorkflow }).unwrap();

        dispatch(setClonedWorkflow(response));
      }

      return;
    }

    const { data: workflows } = await getUserWorkflows().unwrap();

    if (!Array.isArray(workflows) || !workflows.length) {
      return;
    }

    for (const _workflow of workflows) {
      if (typeof _workflow.active !== "boolean" || _workflow.active !== true) {
        continue;
      }

      let credentialFound = false;
      const _updatedWorkflow = structuredClone(_workflow);

      _updatedWorkflow.nodes.forEach(node => {
        if (!node.credentials) {
          return;
        }

        if (!node.credentials[credentialType]) {
          return;
        }

        node.credentials[credentialType].name = "to_be_deleted";
        credentialFound = true;
      });

      if (credentialFound) {
        await updateWorkflow({ workflowId: _updatedWorkflow.id, data: _updatedWorkflow });
      }
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
