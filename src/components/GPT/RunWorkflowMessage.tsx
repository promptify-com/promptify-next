import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import RunButton from "./RunButton";

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
      <RunButton
        onClick={handleActivate}
        disabled={!allowActivateButton || isProcessing}
        loading={isProcessing}
        text="Run"
        noIcon
      />
    </Stack>
  );
}
