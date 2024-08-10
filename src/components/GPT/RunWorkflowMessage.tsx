import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import RunButton from "./RunButton";
import { useAppSelector } from "@/hooks/useStore";
import MessageContainer from "./MessageContainer";
import RunButtonWithProgressBar from "./RunButtonWithProgressBar";
import { Box } from "@mui/material";
import { initialState } from "@/core/store/chatSlice";

interface Props {
  onRun(): void;
  allowActivateButton?: boolean;
}

export default function runWorkflowMessage({ onRun, allowActivateButton }: Props) {
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
