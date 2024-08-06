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
export function LinearWithValueLabel() {
  const [progress, setProgress] = useState(1);
  const gptGenerationStatus = useAppSelector(
    state => state.chat?.gptGenerationStatus ?? initialState.gptGenerationStatus,
  );

  useEffect(() => {
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
    }, EXECUTE_DURATION_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel
        value={progress}
        color="success"
      />
    </Box>
  );
}

export function RunButtonWithProgressBar({ onClick, text = "Run AI App", disabled, loading, sx = {} }: Props) {
  if (loading) {
    return <LinearWithValueLabel />;
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
