import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MessageContainer from "@/components/GPT/MessageContainer";
import { BtnStyle } from "@/components/GPT/Constants";
import type { IMessage } from "@/components/Prompt/Types/chat";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

interface Props {
  message: IMessage;
  onActivate(): Promise<void>;
  allowActivateButton?: boolean;
  title?: string;
  buttonMessage?: string;
}

export default function ActivateWorkflowMessage({
  message,
  onActivate,
  allowActivateButton,
  title,
  buttonMessage,
}: Props) {
  const { fromUser, isHighlight } = message;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivate = async () => {
    setIsProcessing(true);
    await onActivate();
    setIsProcessing(false);
  };

  return (
    <MessageContainer message={message}>
      {message.text && (
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"onSurface"}
          sx={{
            p: "16px 20px",
            borderRadius: fromUser ? "100px 100px 100px 0px" : "0px 100px 100px 100px",
            bgcolor: isHighlight ? "#DFDAFF" : "#F8F7FF",
          }}
        >
          {message.text}
        </Typography>
      )}
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        gap={3}
        sx={{
          p: "40px 20px",
          borderRadius: "0px 24px 24px 24px",
          bgcolor: "#F8F7FF",
        }}
      >
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"common.black"}
        >
          {title ?? `Ready to turn on this GPT`}
        </Typography>
        <Button
          onClick={handleActivate}
          variant="contained"
          disabled={!allowActivateButton || isProcessing}
          sx={BtnStyle}
        >
          {isProcessing && (
            <CircularProgress
              size={"16px"}
              sx={{
                color: "common.black",
                mr: "10px",
              }}
            />
          )}
          {buttonMessage || "Activate"}
        </Button>
      </Stack>
    </MessageContainer>
  );
}
