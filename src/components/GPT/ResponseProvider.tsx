import { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import { BtnStyle, PROVIDERS } from "./Constants";
import {
  cleanCredentialName,
  getNodeInfoByType,
  getProviderParams,
  injectProviderNode,
  replaceProviderParamValue,
} from "@/components/GPTs/helpers";
import { extractCredentialsInput } from "@/components/Automation/helpers";
import type { ICredentialInput, INode, IWorkflow } from "@/components/Automation/types";
import useCredentialsActions from "./Hooks/useCredentialsActions";
import FormModal from "@/components/common/forms/FormModal";
import Check from "@mui/icons-material/Check";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setSelectedWorkflow } from "@/core/store/chatSlice";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import type { ProviderType } from "./Types";

interface Props {
  providerType: ProviderType;
  workflow: IWorkflow;
  onInject(): void;
}

function ResponseProvider({ providerType, workflow, onInject }: Props) {
  const dispatch = useAppDispatch();
  const [credentialInput, setCredentialInput] = useState<ICredentialInput | null>(null);
  const [oauthModalOpened, setOauthModalOpened] = useState(false);
  const [paramsModalOpened, setParamsModalOpened] = useState(false);

  const { selectedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);

  const { credential, isOauthCredential, isConnected, handleOauthConnect, handleAuthFormSubmit } =
    useCredentialsActions({
      credentialInput,
    });

  useEffect(() => {
    prepareCredentials();
  }, []);

  const prepareCredentials = async () => {
    const credentialsInput = (await extractCredentialsInput([providerData as INode]))[0];
    setCredentialInput(credentialsInput);
  };

  const displayName = cleanCredentialName(credentialInput?.displayName ?? "");
  const providerNodeName = `Send ${displayName} Message`;

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

  const handleAddingProvider = (values: Record<string, string>) => {
    if (!credential) {
      throw new Error(`Credential ${credentialInput?.displayName} not connected`);
    }

    setParamsModalOpened(false);

    const prepareParameters = (content: string) => {
      values.content = content;
      return replaceProviderParamValue(providerType, values);
    };

    const nodeData: INode = {
      ...providerData,
      name: providerNodeName,
      credentials: {
        [credential.type]: {
          id: credential.id,
          name: credential.name,
        },
      },
      parameters: {},
    };
    const generatedWorkflow = injectProviderNode(workflow, {
      nodeParametersCB: prepareParameters,
      node: nodeData,
    });

    dispatch(setSelectedWorkflow(generatedWorkflow));
    onInject();
  };

  if (!credentialInput) return;

  const parametersInputs = getProviderParams(providerType);
  const isInjected = !!selectedWorkflow?.data.nodes.find(
    node => node.name === providerNodeName && node.credentials?.[credentialInput.name],
  );

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={2}
      sx={{
        height: "calc(100% - 48px)",
        p: "24px",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isInjected ? "#4EB972" : isConnected ? "#6E45E9" : "#E9E7EC",
        bgcolor: isInjected ? "#F2FFF7" : isConnected ? "#F7F5FC" : "#FFFFFF",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={3}
      >
        <CardMedia
          sx={{
            width: 16,
            height: 16,
            p: "9px",
            borderRadius: "50%",
            border: "1px solid",
            borderColor: "#E9E7EC",
            bgcolor: "#FFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={
              `${process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL}/${providerData.iconUrl}` ??
              require("@/assets/images/default-avatar.jpg")
            }
            alt={providerData.name}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </CardMedia>
        <Stack
          alignItems={"flex-start"}
          gap={1}
        >
          {isConnected && !isInjected && (
            <Typography
              fontSize={10}
              fontWeight={600}
              color={"#6E45E9"}
              textTransform={"uppercase"}
              letterSpacing={".5px"}
            >
              Previously Connected
            </Typography>
          )}
          <Typography
            fontSize={16}
            fontWeight={500}
            color={"onSurface"}
          >
            {providerData.name}
          </Typography>
        </Stack>
      </Stack>
      {isInjected ? (
        <Check
          sx={{
            width: 18,
            height: 18,
            p: "7px",
            borderRadius: "50%",
            bgcolor: "#4EB972",
            color: "#FFF",
          }}
        />
      ) : isConnected ? (
        <Button
          onClick={() => setParamsModalOpened(true)}
          variant="contained"
          sx={BtnStyle}
        >
          Add
        </Button>
      ) : (
        <Button
          onClick={handleConnect}
          variant="contained"
          sx={BtnStyle}
        >
          Connect
        </Button>
      )}
      {oauthModalOpened && (
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
    </Stack>
  );
}

export default ResponseProvider;
