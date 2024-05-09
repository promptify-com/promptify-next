import { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useAppSelector } from "@/hooks/useStore";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  onAbort: () => void;
  isLastExecution?: boolean;
}
interface GenerationTiming {
  startTime: Date | null;
  endTime: Date | null;
  duration: number | null;
}

function ExecutionMessageFooter({ onAbort, isLastExecution }: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const selectedTemplate = useAppSelector(state => state.chat.selectedTemplate);

  const [timing, setTiming] = useState<GenerationTiming>({ startTime: null, endTime: null, duration: null });

  useEffect(() => {
    if (isGenerating) {
      setTiming(timing => ({ ...timing, startTime: new Date(), endTime: null, duration: null }));
    } else if (timing.startTime) {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - timing.startTime.getTime()) / 1000);
      setTiming({ ...timing, endTime, duration });
    }
  }, [isGenerating]);

  const currentGeneratedPrompt = useMemo(() => {
    if (generatedExecution?.data?.length && selectedTemplate) {
      const loadingPrompt = generatedExecution.data.find(prompt => prompt.isLoading);
      const prompt = selectedTemplate.prompts.find(prompt => prompt.id === loadingPrompt?.prompt);
      if (prompt) return prompt;
    }

    return null;
  }, [generatedExecution]);

  return (
    <>
      {isGenerating && isLastExecution ? (
        <Stack
          p={"16px 24px"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <CircularProgress
              color="primary"
              size={"24px"}
            />
            <Typography
              fontSize={15}
              lineHeight={"18px"}
              fontWeight={400}
              letterSpacing={"0.2px"}
              sx={{
                opacity: 0.9,
              }}
            >
              {currentGeneratedPrompt
                ? `Running the prompt ${currentGeneratedPrompt.title} of ${currentGeneratedPrompt.order}/${selectedTemplate?.prompts.length}`
                : "generation in progress"}{" "}
              <span className="animated-ellipsis">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </Typography>
          </Stack>
          <Button
            variant="text"
            sx={{
              color: "onSurface",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
            onClick={onAbort}
          >
            Cancel
          </Button>
        </Stack>
      ) : (
        <Stack p={"16px 24px"}>
          <Typography
            fontSize={15}
            lineHeight={"18px"}
            fontWeight={400}
            letterSpacing={"0.2px"}
            sx={{
              opacity: 0.9,
            }}
          >
            Generation done in {timing.duration} second{timing.duration === 1 ? "" : "s"}
          </Typography>
        </Stack>
      )}
    </>
  );
}

export default ExecutionMessageFooter;
