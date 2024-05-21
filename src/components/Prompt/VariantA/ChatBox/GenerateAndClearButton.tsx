import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PlayCircle from "@mui/icons-material/PlayCircle";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

import { setAnswers } from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";

interface Props {
  isValidating: boolean;
  showGenerate: boolean;
  onGenerate: () => void;
}

function GenerateAndClearButton({ isValidating, showGenerate, onGenerate }: Props) {
  const dispatch = useAppDispatch();
  const selectedExecution = useAppSelector(state => state.executions?.selectedExecution ?? null);
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const answers = useAppSelector(state => state.chat?.answers ?? []);
  const isSimulationStreaming = useAppSelector(state => state.chat?.isSimulationStreaming ?? false);

  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);

  const isExecutionShown = Boolean(selectedExecution ?? generatedExecution);

  return (
    <Stack
      mx={{ md: "32px" }}
      gap={2}
      pb={"8px"}
    >
      {!isValidating && !isSimulationStreaming && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={2}
          flexWrap={"wrap"}
          ml={{ xs: "16px", md: !isExecutionShown ? "50px" : 0 }}
        >
          {showGenerate && (
            <Button
              onClick={onGenerate}
              endIcon={<PlayCircle />}
              sx={{
                height: "22px",
                p: "15px",
                fontSize: 13,
                fontWeight: 500,
                bgcolor: "primary.main",
                borderColor: "primary.main",
                ":hover": {
                  bgcolor: "surface.1",
                  color: "primary.main",
                },
              }}
              variant="contained"
              disabled={isGenerating || isValidating}
            >
              Run prompt
            </Button>
          )}
          {!!answers.length && !generatedExecution && (
            <Button
              variant="text"
              endIcon={<DeleteOutline />}
              sx={{
                height: "22px",
                p: "15px",
                fontSize: 13,
                fontWeight: 500,
                border: "1px solid",
                borderColor: "divider",
                color: "secondary.main",
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => dispatch(setAnswers([]))}
            >
              Clear
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default GenerateAndClearButton;
