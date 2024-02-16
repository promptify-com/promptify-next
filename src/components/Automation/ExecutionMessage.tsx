import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import type { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";

interface Props {
  // title: string;
  execution: PromptLiveResponse | TemplatesExecutions | null;
}

export const ExecutionMessage: React.FC<Props> = ({ execution }) => {
  const executionPrompts = execution && "data" in execution ? execution.data : execution?.prompt_executions;
  const [prompts, setPrompts] = useState<DisplayPrompt[]>([]);

  useEffect(() => {
    const sortAndProcessExecutions = async () => {
      const processedOutputs = await Promise.all(
        [...(executionPrompts || [])].map(async exec => {
          const _content = "message" in exec ? exec.message : exec.output;

          return {
            ...exec,
            content: await markdownToHTML(_content),
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
      sx={{
        width: { md: "90%" },
        mx: { md: "40px" },
      }}
    >
      {execution && (
        <Stack
          direction={{ md: "row" }}
          justifyContent={"space-between"}
        >
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
                  <Box
                    sx={{
                      width: "100%",
                      fontSize: { xs: 14, md: 15 },
                      fontWeight: 400,
                      color: "onSurface",
                      wordWrap: "break-word",
                      textAlign: "justify",
                      float: "none",
                      ".highlight": {
                        backgroundColor: "yellow",
                        color: "black",
                      },
                      pre: {
                        m: "10px 0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        code: {
                          borderRadius: 0,
                          m: 0,
                        },
                      },
                      code: {
                        display: "block",
                        bgcolor: "#282a35",
                        color: "common.white",
                        borderRadius: "8px",
                        p: "16px 24px",
                        mb: "10px",
                        overflow: "auto",
                      },
                      ".language-label": {
                        p: "8px 24px",
                        bgcolor: "#4d5562",
                        color: "#ffffff",
                        fontSize: 13,
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(exec.content),
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
