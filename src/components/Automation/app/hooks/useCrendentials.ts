import { useState } from "react";
import { extractCredentialsInput } from "../helpers";
import Storage from "@/common/storage";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useGetUserWorkflowsQuery, useUpdateWorkflowMutation, workflowsApi } from "@/core/api/workflows";
import { setCredentialsInput, setSelectedApp } from "@/core/store/chatSlice";
import type { ICredential, ICredentialInput, INode, IWorkflowCreateResponse } from "@/components/Automation/types";
import type { IApp } from "@/components/Automation/app/hooks/types";

const useCredentials = () => {
  const { selectedApp } = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();

  const [updateApp] = useUpdateWorkflowMutation();
  const [getUserWorkflows] = workflowsApi.endpoints.getUserWorkflows.useLazyQuery();
  const [getCredentials] = workflowsApi.endpoints.getCredentials.useLazyQuery();

  const [credentials, setCredentials] = useState<ICredential[]>(
    (Storage.get("credentials") as unknown as ICredential[]) || [],
  );

  const initializeCredentials = async (): Promise<ICredential[]> => {
    try {
      const apiCredentials = await getCredentials().unwrap();
      if (apiCredentials) {
        setCredentials(apiCredentials);
        Storage.set("credentials", JSON.stringify(apiCredentials));
      }

      return apiCredentials || [];
    } catch (error) {
      console.error("Failed fetching Credentials", error);
      return credentials;
    }
  };

  async function extractCredentialsInputFromNodes(nodes: INode[]) {
    await initializeCredentials();
    const _credentialsInput = await extractCredentialsInput(nodes);
    dispatch(setCredentialsInput(_credentialsInput));
    return _credentialsInput;
  }

  const checkAllCredentialsStored = (credentialsInput: ICredentialInput[]) => {
    const _credentials = (Storage.get("credentials") as ICredential[]) || [];
    return credentialsInput.every(input => _credentials.some(credential => credential.type === input.name));
  };

  const checkCredentialInserted = (credential: ICredentialInput) => {
    const _credentials = (Storage.get("credentials") as ICredential[]) || [];
    return _credentials.findIndex(c => c.type === credential?.name) !== -1;
  };

  const updateCredentials = (newCredential: ICredential) => {
    const updatedCredentials = Storage.get("credentials") || ([] as ICredential[]);
    updatedCredentials.push(newCredential);
    setCredentials(updatedCredentials);
    Storage.set("credentials", JSON.stringify(updatedCredentials));
  };

  const removeCredential = (credentialId: string) => {
    const _credentials = (Storage.get("credentials") as ICredential[]) || [];
    const updatedCredentials = _credentials.filter(credential => credential.id !== credentialId);
    setCredentials(updatedCredentials);
    Storage.set("credentials", JSON.stringify(updatedCredentials));
  };

  async function updateWorkflowAfterCredentialsDeletion(credentialType: string, allWorkflows: boolean) {
    if (!allWorkflows && selectedApp?.id) {
      const _updatedWorkflow = structuredClone(selectedApp)!;
      let credentialFound = false;
      _updatedWorkflow.nodes.forEach(node => {
        if (node.credentials?.[credentialType]) {
          node.credentials[credentialType].name = "to_be_deleted";
          credentialFound = true;
        }
      });
      if (credentialFound) {
        const response = await updateApp({
          workflowId: selectedApp.id,
          data: _updatedWorkflow as unknown as IWorkflowCreateResponse,
        }).unwrap();
        dispatch(setSelectedApp(response as unknown as IApp));
      }
    } else {
      const { data: apps } = await getUserWorkflows();

      if (!apps || !apps.length) {
        console.warn("No apps found or apps data is undefined");
        return;
      }

      for (const _app of apps) {
        if (_app.active) {
          let credentialFound = false;
          const _updatedWorkflow = structuredClone(_app);
          _updatedWorkflow.nodes.forEach(node => {
            if (node.credentials?.[credentialType]) {
              node.credentials[credentialType].name = "to_be_deleted";
              credentialFound = true;
            }
          });
          if (credentialFound) {
            await updateApp({
              workflowId: _updatedWorkflow.id,
              data: _updatedWorkflow as unknown as IWorkflowCreateResponse,
            }).unwrap();
          }
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
    extractCredentialsInputFromNodes,
    removeCredential,
    updateWorkflowAfterCredentialsDeletion,
  };
};

export default useCredentials;
