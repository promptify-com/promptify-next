import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import type { ICredentialInput, IWorkflow } from "@/components/Automation/types";
import Credentials from "@/components/Prompt/Common/Chat/Inputs/Credentials";
import { CardMedia, Typography } from "@mui/material";
import Image from "@/components/design-system/Image";
import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import Check from "@mui/icons-material/Check";

interface Props {
  message: string;
  workflow: IWorkflow;
}

function CredentialsContainer({ message, workflow }: Props) {
  const [localInputs, setLocalInputs] = useState<ICredentialInput[]>([]);
  const { areCredentialsStored } = useAppSelector(state => state.chat ?? initialChatState);

  const { extractCredentialsInputFromNodes } = useCredentials();

  const prepareCredential = async () => {
    const credentialsInput = await extractCredentialsInputFromNodes(workflow.data.nodes);
    setLocalInputs(credentialsInput);
  };

  useEffect(() => {
    prepareCredential();
  }, [workflow]);

  return (
    <Stack gap={4}>
      {message && (
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"common.black"}
        >
          {message}
        </Typography>
      )}
      <Stack
        gap={2}
        minWidth={"600px"}
      >
        {localInputs.map(input => (
          <Stack
            key={input.name}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
            sx={{
              p: "24px",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: areCredentialsStored ? "#4EB972" : "#E9E7EC",
              bgcolor: areCredentialsStored ? "#F2FFF7" : "#F8F7FF",
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
                    `${process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL}/${input.iconUrl}` ??
                    require("@/assets/images/default-avatar.jpg")
                  }
                  alt={input.displayName}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </CardMedia>
              <Typography
                fontSize={16}
                fontWeight={500}
                color={"onSurface"}
              >
                {input.displayName}
              </Typography>
            </Stack>
            {areCredentialsStored ? (
              <Check
                sx={{
                  width: 18,
                  height: 18,
                  p: "6px",
                  borderRadius: "50%",
                  bgcolor: "#4EB972",
                  color: "#FFF",
                }}
              />
            ) : (
              <Credentials input={input} />
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default CredentialsContainer;
