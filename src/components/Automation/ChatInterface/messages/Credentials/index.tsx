import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import Image from "@/components/design-system/Image";
import { cleanCredentialName } from "@/components/Automation/helpers";
import CredentialCard from "@/components/Automation/ChatInterface/messages/Credentials/CredentialCard";
import { useAppSelector } from "@/hooks/useStore";
import useCredentials from "@/components/Automation/app/hooks/useCrendentials";
import type { IWorkflow } from "@/components/Automation/types";

interface Props {
  workflow: IWorkflow;
  scrollToBottom?: () => void;
}

function CredentialsContainer({ workflow, scrollToBottom }: Props) {
  const { checkCredentialInserted } = useCredentials();

  const credentials = useAppSelector(state => state.chat.credentialsInput);

  useEffect(() => {
    scrollToBottom?.();
  }, [workflow]);

  return (
    <Stack
      gap={4}
      maxWidth={"700px"}
    >
      <Typography
        fontSize={16}
        fontWeight={500}
        color={"common.black"}
      >
        Please connect the following credentials for the workflow:
      </Typography>
      <Stack
        gap={2}
        minWidth={{ md: "600px" }}
      >
        {credentials.map(input => (
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
                    `${process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL}/${input.iconUrl}` ||
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

            <CredentialCard input={input} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default CredentialsContainer;
