import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import SystemAvatar from "../../SystemAvatar";
import RunButtonWithProgressBar from "./RunButton";
interface Props {
  onRun(): void;
  estimatedExecutionTime: string | null;
  runInstantly?: boolean;
}

export default function RunButtonMessage({ onRun, estimatedExecutionTime, runInstantly = false }: Props) {
  //   const gptGenerationStatus = useAppSelector(state => state.chat.gptGenerationStatus);
  const gptGenerationStatus: "started" | "pending" | "generating" | undefined = undefined;
  useEffect(() => {
    if (runInstantly) {
      onRun();
    }
  }, [runInstantly]);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={2}
      sx={{
        width: "fit-content",
        p: "16px 20px",
        borderRadius: "8px",
        bgcolor: "#fff",
      }}
    >
      <SystemAvatar />
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
        onClick={() => onRun()}
        text="Run"
        sx={{ p: "8px 24px" }}
        loading={gptGenerationStatus === "started"}
        disabled={gptGenerationStatus !== "pending"}
      />
    </Stack>
  );
}
