import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import RunButton from "./RunButton";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  onRun(): Promise<void>;
  allowActivateButton?: boolean;
}

export default function runWorkflowMessage({ onRun, allowActivateButton }: Props) {
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);

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
        onClick={onRun}
        disabled={!allowActivateButton || isGenerating}
        loading={isGenerating}
        text="Run"
      />
    </Stack>
  );
}
