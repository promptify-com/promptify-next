import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import type { ICredentialInput, ITemplateWorkflow } from "@/components/Automation/types";
import Credentials from "@/components/Prompt/Common/Chat/Inputs/Credentials";
import { CardMedia, Typography } from "@mui/material";
import Image from "@/components/design-system/Image";
import { cleanCredentialName } from "../GPTs/helpers";

interface Props {
  message: string;
  workflow: ITemplateWorkflow;
  isScheduled?: boolean;
  scrollToBottom?: () => void;
}

function CredentialsContainer({ message, workflow, scrollToBottom }: Props) {
  const [localInputs, setLocalInputs] = useState<ICredentialInput[]>([]);

  const { extractCredentialsInputFromNodes, checkCredentialInserted } = useCredentials();

  const prepareCredential = async () => {
    const credentialsInput = await extractCredentialsInputFromNodes(workflow.data.nodes);

    setLocalInputs(credentialsInput);
  };

  useEffect(() => {
    prepareCredential();
    scrollToBottom?.();
  }, [workflow]);

  return (
    <Stack
      gap={4}
      minHeight={"200px"}
    >
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
        minWidth={{ md: "600px" }}
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
              borderColor: checkCredentialInserted(input) ? "#4EB972" : "#E9E7EC",
              bgcolor: checkCredentialInserted(input) ? "#F2FFF7" : "#F8F7FF",
            }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
            >
              <CardMedia
                sx={{
                  width: 22,
                  height: 22,
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
                {cleanCredentialName(input.displayName)}
              </Typography>
            </Stack>

            <Credentials input={input} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default CredentialsContainer;
