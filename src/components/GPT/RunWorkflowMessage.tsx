import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import RunButton from "./RunButton";
import { useAppSelector } from "@/hooks/useStore";
import MessageContainer from "./MessageContainer";

interface Props {
  onRun(): Promise<void>;
  allowActivateButton?: boolean;
}

export default function runWorkflowMessage({ onRun, allowActivateButton }: Props) {
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);

  return (
    <MessageContainer>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
        sx={{
          p: "10px 16px",
          borderRadius: "0px 16px 16px 16px",
          bgcolor: "#DFDAFF",
        }}
      >
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"onSurface"}
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
    </MessageContainer>
  );
}
