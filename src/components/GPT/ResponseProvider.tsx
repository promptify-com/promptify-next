import { useEffect, useMemo, useState } from "react";
import { PROVIDERS } from "./Constants";
import {
  cleanCredentialName,
  getNodeInfoByType,
  getProviderParams,
  injectProviderNode,
  nameProvider,
  replaceProviderParamValue,
} from "@/components/GPTs/helpers";
import { extractCredentialsInput } from "@/components/Automation/helpers";
import type {
  ICredentialInput,
  INode,
  ITemplateWorkflow,
  IWorkflowCreateResponse,
} from "@/components/Automation/types";
import useCredentialsActions from "./Hooks/useCredentialsActions";
import FormModal from "@/components/common/forms/FormModal";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setClonedWorkflow } from "@/core/store/chatSlice";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import type { ProviderType } from "./Types";
import ProviderCard from "./ProviderCard";
import { setToast } from "@/core/store/toastSlice";
import { useDeleteCredentialMutation } from "@/core/api/workflows";
import useCredentials from "@/components/Automation/Hooks/useCredentials";

interface Props {
  providerType: ProviderType;
  workflow: ITemplateWorkflow;
  onInject(workflow: IWorkflowCreateResponse): void;
  onUnselect(providerName: string): IWorkflowCreateResponse;
}

function ResponseProvider({ providerType, workflow, onInject, onUnselect }: Props) {
  const dispatch = useAppDispatch();
  const [credentialInput, setCredentialInput] = useState<ICredentialInput | null>(null);
  const [oauthModalOpened, setOauthModalOpened] = useState(false);
  const [paramsModalOpened, setParamsModalOpened] = useState(false);

  const clonedWorkflow = useAppSelector(state => state.chat?.clonedWorkflow ?? initialChatState.clonedWorkflow);

  const { credential, isOauthCredential, isConnected, handleOauthConnect, handleAuthFormSubmit } =
    useCredentialsActions({
      credentialInput,
    });

  const { removeCredential, updateWorkflowAfterCredentialsDeletion } = useCredentials();
  const [deleteCredential] = useDeleteCredentialMutation();

  useEffect(() => {
    prepareCredentials();
  }, []);

  const prepareCredentials = async () => {
    const credentialsInput = (await extractCredentialsInput([providerData as INode]))[0];
    setCredentialInput(credentialsInput);
  };

  const displayName = cleanCredentialName(credentialInput?.displayName ?? "");
  const providerNodeName = nameProvider(displayName);

  const providerData = useMemo(() => {
    const node = getNodeInfoByType(providerType);
    const provider = PROVIDERS[providerType];

    return { ...provider, ...node };
  }, [providerType]);

  const handleConnect = async () => {
    if (isOauthCredential) {
      await handleOauthConnect();
    } else {
      setOauthModalOpened(true);
    }
  };

  const submitAuthFormModal = async (values: Record<string, string>) => {
    await handleAuthFormSubmit(values);
    setOauthModalOpened(false);
  };

  const handleAddingProvider = (values: Record<string, string> = {}) => {
    if (!credential) {
      throw new Error(`Credential ${credentialInput?.displayName} not connected`);
    }

    if (!clonedWorkflow) {
      throw new Error("Cloned workflow not found");
    }
    if (!workflow) {
      throw new Error("Template workflow not found");
    }

    setParamsModalOpened(false);

    const prepareParameters = (content: string) => {
      values.content = content;
      return replaceProviderParamValue(providerType, values);
    };

    let nodeData: INode = {
      ...providerData,
      name: providerNodeName,
      parameters: {},
      credentials: {},
    };
    if (credential) {
      nodeData.credentials![credential.type] = {
        id: credential.id,
        name: credential.name,
      };
    }

    const generatedWorkflow = injectProviderNode(clonedWorkflow, {
      nodeParametersCB: prepareParameters,
      node: nodeData,
    });

    dispatch(setClonedWorkflow(generatedWorkflow));
    onInject(generatedWorkflow);
  };

  const handleUnSelect = () => {
    onUnselect(providerNodeName);
  };

  const handleReconnect = async () => {
    await deleteCredential(credential?.id as string);
    await updateWorkflowAfterCredentialsDeletion(credential?.type as string, false);
    onUnselect(providerNodeName);
    dispatch(setToast({ message: "Credential and provider was successfully deleted.", severity: "info" }));
    removeCredential(credential?.id as string);
    handleConnect();
  };

  const parametersInputs = getProviderParams(providerType);
  const isInjected = !!clonedWorkflow?.nodes.find(node => node.name === providerNodeName);

  return (
    <>
      <ProviderCard
        iconUrl={providerData.iconUrl}
        name={providerData.name}
        isConnected={isConnected}
        isInjected={isInjected}
        onConnect={handleConnect}
        onInject={() => {
          if (parametersInputs.length) {
            setParamsModalOpened(true);
          } else {
            handleAddingProvider();
          }
        }}
        onUnselect={handleUnSelect}
        onReconnect={handleReconnect}
      />
      {credentialInput && oauthModalOpened && (
        <FormModal
          title={`${displayName} Credentials`}
          inputs={credentialInput.properties.map(prop => ({
            ...prop,
            required: !!prop.required,
            type: prop.typeOptions?.password ? "password" : prop.type,
          }))}
          onSubmit={submitAuthFormModal}
          onClose={() => setOauthModalOpened(false)}
        />
      )}
      {paramsModalOpened && (
        <FormModal
          title={`${displayName} Parameters`}
          inputs={parametersInputs}
          onSubmit={handleAddingProvider}
          onClose={() => setParamsModalOpened(false)}
        />
      )}
    </>
  );
}

export default ResponseProvider;
