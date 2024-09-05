import { useEffect, useState } from "react";
import type { SxProps } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import type { LinearProgressProps } from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import { BtnStyle } from "./Constants";
import { initialState } from "@/core/store/chatSlice";
import LoadingDots from "../design-system/LoadingDots";

interface Props {
  onClick: () => void;
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  sx?: SxProps;
  estimatedExecutionTime?: string | null;
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  const maxValueReached = props.value === 99;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: maxValueReached ? 0 : 1 }}>
        {maxValueReached ? (
          <LinearProgress color="success" />
        ) : (
          <LinearProgress
            variant="determinate"
            {...props}
          />
        )}
      </Box>
      <Box sx={{ minWidth: 35, ...(maxValueReached && { display: "none" }) }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const EXECUTE_DURATION_INTERVAL = 100;

function parseExecutionTime(timeString: string | null): number {
  if (!timeString) return EXECUTE_DURATION_INTERVAL;

  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  // Calculate the interval based on the total time
  // Assuming 100 steps for the progress bar, so we divide the total time by 100
  return (totalSeconds * 1000) / 100;
}

export function LinearWithValueLabel({ estimatedExecutionTime }: { estimatedExecutionTime: string | null }) {
  const [progress, setProgress] = useState(1);
  const gptGenerationStatus = useAppSelector(
    state => state.chat?.gptGenerationStatus ?? initialState.gptGenerationStatus,
  );

  useEffect(() => {
    const interval = parseExecutionTime(estimatedExecutionTime);
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (gptGenerationStatus === "generated") {
          clearInterval(timer);
          return 100;
        }

        if (prevProgress >= 99) {
          return 99;
        }

        return prevProgress + 1;
      });
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [estimatedExecutionTime, gptGenerationStatus]);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel
        value={progress}
        color="success"
      />
    </Box>
  );
}

export function RunButtonWithProgressBar({
  onClick,
  text = "Run AI App",
  disabled,
  loading,
  sx = {},
  estimatedExecutionTime,
}: Props) {
  if (loading && estimatedExecutionTime) {
    return <LinearWithValueLabel estimatedExecutionTime={estimatedExecutionTime} />;
  }

  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        ...BtnStyle,
        p: "13px 24px",
        ...sx,
      }}
    >
      {disabled ? (
        <>
          {"Generating"} <LoadingDots />
        </>
      ) : (
        text
      )}
    </Button>
  );
}

export default RunButtonWithProgressBar;
