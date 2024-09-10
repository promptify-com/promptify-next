import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "@/hooks/useStore";
import MessageContainer from "./MessageContainer";
import RunButtonWithProgressBar from "./RunButtonWithProgressBar";
import { initialState } from "@/core/store/chatSlice";
import type { ITemplateWorkflow } from "../Automation/types";
import { useMemo } from "react";
1;
interface Props {
  onRun(): void;
  estimatedExecutionTime: string | null;
  runInstantly?: boolean;
}

export default function runWorkflowMessage({ onRun, estimatedExecutionTime, runInstantly = false }: Props) {
  const gptGenerationStatus = useAppSelector(
    state => state.chat?.gptGenerationStatus ?? initialState.gptGenerationStatus,
  );

  const runWorkflow = useMemo(() => {
    if (!runInstantly) {
      return;
    }
    onRun();
  }, [runInstantly]);

  return (
    <MessageContainer>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
        sx={{
          width: gptGenerationStatus === "started" ? "68%" : "fit-content",
          p: "16px 20px",
          borderRadius: "0px 16px 16px 16px",
          bgcolor: "#DFDAFF",
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: "onSurface",
            ...(gptGenerationStatus === "started" && {
              whiteSpace: "nowrap",
              width: "45%",
              mr: "10px",
            }),
          }}
        >
          Ready to test this AI App
        </Typography>
        <RunButtonWithProgressBar
          estimatedExecutionTime={estimatedExecutionTime}
          onClick={() => {
            runInstantly ? runWorkflow : onRun();
          }}
          text="Run"
          sx={{ p: "8px 24px" }}
          loading={gptGenerationStatus === "started"}
          disabled={gptGenerationStatus !== "pending"}
        />
      </Stack>
    </MessageContainer>
  );
}
