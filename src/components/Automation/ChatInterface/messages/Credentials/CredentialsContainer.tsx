"use client";

import Image from "next/image";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";

import { useAppSelector } from "@/hooks/useStore";
import { cleanCredentialName } from "@/components/Automation/helpers";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import CredentialCard from "@/components/Automation/ChatInterface/messages/Credentials/CredentialCard";

interface Props {
  message?: string;
  isScheduled?: boolean;
  scrollToBottom?: () => void;
  showMessage?: boolean;
}

function CredentialsContainer({ message, showMessage = true }: Props) {
  const credentialInputs = useAppSelector(state => state.chat.credentialsInput);

  const { checkCredentialInserted } = useCredentials();

  if (!credentialInputs?.length) {
    return null;
  }

  return (
    <Stack gap={4}>
      {showMessage && (
        <>
          {message ? (
            <Typography
              fontSize={16}
              fontWeight={500}
              color={"common.black"}
            >
              {message}
            </Typography>
          ) : (
            <Stack
              direction={"column"}
              alignItems={"start"}
              spacing={1}
              py="8px"
            >
              <Typography
                fontSize={30}
                fontWeight={600}
                color={"onSurface"}
              >
                Credentials
              </Typography>
            </Stack>
          )}
        </>
      )}

      <Stack gap={2}>
        {credentialInputs?.map(input => (
          <Stack
            key={input.name}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
            sx={{
              p: "20px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: checkCredentialInserted(input) ? "#70CD4E" : "#E9E7EC",
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
                  position: "relative",
                  alignItems: "center",
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL}/${input.iconUrl}`}
                  alt={input.displayName}
                  fill
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  }}
                  sizes="22px"
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
