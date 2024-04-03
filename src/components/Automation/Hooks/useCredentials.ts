import { useState } from "react";
import Storage from "@/common/storage";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { workflowsApi } from "@/core/api/workflows";
import { extractCredentialsInput } from "@/components/Automation/helpers";
import { setCredentialsInput } from "@/core/store/chatSlice";
import type { ICredential, ICredentialInput, INode } from "@/components/Automation/types";

const useCredentials = () => {
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState<ICredential[]>(
    (Storage.get("credentials") as unknown as ICredential[]) || [],
  );
  const credentialsInput = useAppSelector(state => state.chat.credentialsInput);
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
      } catch (error) {
        console.error("Failed fetching Credentials");
      } finally {
        resolve(credentials);
      }
    });
  };

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
    return !!credentials.find(c => c.type === credential?.name);
  };

  const updateCredentials = (newCredential: ICredential) => {
    const updatedCredentials = (Storage.get("credentials") as unknown as ICredential[]) || [];
    updatedCredentials.push(newCredential);
    setCredentials(updatedCredentials);
    Storage.set("credentials", JSON.stringify(updatedCredentials));
  };

  const removeCredential = (credentialId: string) => {
    const updatedCredentials = credentials.filter(credential => credential.id !== credentialId);
    setCredentials(updatedCredentials);
    Storage.set("credentials", JSON.stringify(updatedCredentials));
  };

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
  };
};

export default useCredentials;
