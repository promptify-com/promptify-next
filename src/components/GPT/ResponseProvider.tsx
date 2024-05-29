import { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import { PROVIDERS } from "./Constants";
import {
  getNodeInfoByType,
  getProviderParams,
  injectProviderNode,
  replaceProviderParamValue,
} from "@/components/GPTs/helpers";
import { extractCredentialsInput } from "@/components/Automation/helpers";
import type { ICredentialInput, INode, IWorkflow } from "@/components/Automation/types";
import useCredentialsActions from "./Hooks/useCredentialsActions";
import FormModal from "@/components/common/forms/FormModal";

interface Props {
  providerType: string;
  workflow: IWorkflow;
}

function ResponseProvider({ providerType, workflow }: Props) {
  const [credentialInput, setCredentialInput] = useState<ICredentialInput | null>(null);
  const [oauthModalOpened, setOauthModalOpened] = useState(false);
  const [paramsModalOpened, setParamsModalOpened] = useState(false);
  const type = providerType as keyof typeof PROVIDERS;

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

  const displayName = credentialInput?.displayName.replace(/Api\s*|Oauth2\s*/gi, "").trim();

  const providerData = useMemo(() => {
    const node = getNodeInfoByType(type);
    const provider = PROVIDERS[type];
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

    const prepareParameters = (content: string) => {
      values.content = content;
      return replaceProviderParamValue(type, values);
    };

    const nodeData: INode = {
      ...providerData,
      name: `Send ${displayName} Message`,
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
    console.log(workflow);
    console.log(generatedWorkflow);
  };

  if (!credentialInput) return;

  const parametersInputs = getProviderParams(type);

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={2}
      sx={{
        p: "24px",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isConnected ? "#4EB972" : "#E9E7EC",
        bgcolor: isConnected ? "#F2FFF7" : "#FFFFFF",
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
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"onSurface"}
        >
          {providerData.name}
        </Typography>
      </Stack>
      {isConnected ? (
        <Button
          onClick={() => setParamsModalOpened(true)}
          variant="contained"
          sx={btnStyle}
        >
          Add
        </Button>
      ) : (
        <Button
          onClick={handleConnect}
          variant="contained"
          sx={btnStyle}
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

const btnStyle = {
  bgcolor: "#6E45E9",
  color: "common.white",
  fontSize: 13,
  fontWeight: 500,
  p: "10px 24px",
  ":hover": {
    bgcolor: "#5632c2",
    color: "common.white",
  },
};
