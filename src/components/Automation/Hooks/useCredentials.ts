import { useState } from "react";
import Storage from "@/common/storage";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { workflowsApi, useUpdateWorkflowMutation } from "@/core/api/workflows";
import { extractCredentialsInput } from "@/components/Automation/helpers";
import { setAreCredentialsStored, setCredentialsInput, initialState as initialChatState } from "@/core/store/chatSlice";
import type {
  ICredential,
  ICredentialInput,
  INode,
  INodeCredentials,
  IStoredWorkflows,
} from "@/components/Automation/types";

const useCredentials = () => {
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState<ICredential[]>(
    (Storage.get("credentials") as unknown as ICredential[]) || [],
  );
  const credentialsInput = useAppSelector(state => state.chat?.credentialsInput ?? initialChatState.credentialsInput);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [getCredentials] = workflowsApi.endpoints.getCredentials.useLazyQuery();
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
    const storedWorkflows = (Storage.get("workflows") as unknown as IStoredWorkflows) || {};

    if (!!Object.values(storedWorkflows).length) {
      for (const _workflowId in storedWorkflows) {
        const _workflow = await getWorkflow(storedWorkflows[_workflowId].id).unwrap();
        let credentialFound = false;
        const _updatedWorkflow = {
          ..._workflow,
          nodes: _workflow.nodes.map(node => ({
            ...node,
            ...(node.credentials && { credentials: recreateNodeCredentials(node.credentials) }),
          })),
        };

        _updatedWorkflow.nodes.forEach(node => {
          if (!node.credentials) {
            return;
          }

          if (node.credentials[credentialType]) {
            node.credentials[credentialType].name = "to_be_deleted";
            credentialFound = true;
          }
        });

        if (credentialFound) {
          await updateWorkflow({ workflowId: Number(_workflowId), data: _updatedWorkflow });
          dispatch(setAreCredentialsStored(false));
        }
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
