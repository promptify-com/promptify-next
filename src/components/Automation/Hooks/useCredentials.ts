import { useRef } from "react";
import Storage from "@/common/storage";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { workflowsApi } from "@/core/api/workflows";
import { extractCredentialsInput } from "@/components/Automation/helpers";
import { setCredentialsInput } from "@/core/store/chatSlice";
import type { ICredential, ICredentialInput, INode } from "@/components/Automation/types";

const useCredentials = () => {
  const dispatch = useAppDispatch();
  const credentials = useRef<ICredential[]>(Storage.get("credentials") || []);

  const credentialsInput = useAppSelector(state => state.chat.credentialsInput);

  const [getCredentials] = workflowsApi.endpoints.getCredentials.useLazyQuery();

  const initializeCredentials = () => {
    return new Promise(async resolve => {
      if (!!credentials.current.length) {
        return resolve("");
      }
      try {
        const fetchedCredentials = await getCredentials().unwrap();
        credentials.current = fetchedCredentials;
        if (!fetchedCredentials.length) {
          return;
        }
        Storage.set("credentials", JSON.stringify(fetchedCredentials));
      } catch (error) {
        console.error("Failed fetching Credentials");
      } finally {
        resolve("");
      }
    });
  };

  async function extractCredentialsInputFromNodes(nodes: INode[]) {
    await initializeCredentials();
    const credentialsInput = await extractCredentialsInput(nodes);
    dispatch(setCredentialsInput(credentialsInput));
    return credentialsInput;
  }

  const checkAllCredentialsStored = (credentialsInput: ICredentialInput[]) => {
    if (!credentialsInput.length || !credentials.current.length) {
      return false;
    }
    return credentialsInput.every(input => credentials.current.some(credential => credential.type === input.name));
  };

  const checkCredentialInserted = (credential: ICredentialInput) => {
    return !!credentials.current.find(c => c.type === credential?.name);
  };

  const updateCredentials = (newCredential: ICredential) => {
    const currentCredentials = Storage.get("credentials") || [];

    const updatedCredentials = [...currentCredentials, newCredential];

    credentials.current = updatedCredentials;

    Storage.set("credentials", JSON.stringify(updatedCredentials));
  };

  return {
    credentials: credentials.current,
    checkCredentialInserted,
    initializeCredentials,
    checkAllCredentialsStored,
    updateCredentials,
    credentialsInput,
    extractCredentialsInputFromNodes,
  };
};

export default useCredentials;
