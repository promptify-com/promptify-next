import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { ExecutionContent } from "@/components/common/ExecutionContent";
import type { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";

interface Props {
  execution: PromptLiveResponse;
}

export const ExecutionMessage: React.FC<Props> = ({ execution }) => {
  const executionPrompts = execution.data;
  const [prompts, setPrompts] = useState<DisplayPrompt[]>([]);

  useEffect(() => {
    const sortAndProcessExecutions = async () => {
      const processedOutputs: DisplayPrompt[] = await Promise.all(
        executionPrompts.map(async exec => {
          const content = await markdownToHTML(exec.message);
          return {
            content,
            prompt: exec.prompt,
            created_at: exec.created_at,
            isLoading: exec.isLoading,
            isCompleted: exec.isCompleted,
            isFailed: exec.isFailed,
          };
        }),
      );

      setPrompts(processedOutputs);
    };

    sortAndProcessExecutions();
  }, [executionPrompts]);

  return (
    <Stack
      gap={1}
      className="vite"
      sx={{
        width: "-webkit-fill-available",
        my: "20px",
        p: { xs: "32px 8px 10px 8px", md: "32px" },
        bgcolor: "#F8F7FF",
        borderRadius: "0px 16px 16px 16px",
      }}
    >
      {execution && (
        <Stack
          py={{ xs: "10px", md: "20px" }}
          gap={4}
        >
          {execution.temp_title && (
            <Typography
              fontSize={{ xs: 18, md: 22 }}
              fontWeight={400}
            >
              {execution.temp_title}
            </Typography>
          )}
          <Stack gap={1}>
            {prompts?.map((exec, index) => (
              <Stack
                key={index}
                gap={1}
                sx={{ pb: "24px" }}
              >
                <Stack
                  direction={{ md: "row" }}
                  gap={2}
                >
                  <ExecutionContent content={sanitizeHTML(exec.content)} />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
