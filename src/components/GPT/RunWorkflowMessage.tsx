import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { BtnStyle } from "@/components/GPT/Constants";
import type { IMessage } from "@/components/Prompt/Types/chat";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import MessageContainer from "./MessageContainer";
import { createMessage } from "../Chat/helper";

interface Props {
  onRun(): Promise<void>;
  allowActivateButton?: boolean;
}

export default function runWorkflowMessage({ onRun, allowActivateButton }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivate = async () => {
    setIsProcessing(true);
    await onRun();
    setIsProcessing(false);
  };

  return (
    <MessageContainer
      message={createMessage({
        text: "",
        type: "text",
        noHeader: true,
      })}
    >
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
          Ready to test this GPT
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
          Run
        </Button>
      </Stack>
    </MessageContainer>
  );
}
