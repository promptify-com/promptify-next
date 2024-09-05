import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "@/hooks/useStore";
import MessageContainer from "./MessageContainer";
import RunButtonWithProgressBar from "./RunButtonWithProgressBar";
import { initialState } from "@/core/store/chatSlice";
import type { ITemplateWorkflow } from "../Automation/types";
1;
interface Props {
  onRun(): void;
  estimatedExecutionTime: string | null;
}

export default function runWorkflowMessage({ onRun, estimatedExecutionTime }: Props) {
  const gptGenerationStatus = useAppSelector(
    state => state.chat?.gptGenerationStatus ?? initialState.gptGenerationStatus,
  );

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
          onClick={onRun}
          text="Run"
          sx={{ p: "8px 24px" }}
          loading={gptGenerationStatus === "started"}
          disabled={gptGenerationStatus !== "pending"}
        />
      </Stack>
    </MessageContainer>
  );
}
