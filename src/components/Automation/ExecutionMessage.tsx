import { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import type { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";

interface Props {
  execution: PromptLiveResponse | TemplatesExecutions | null;
}

export const ExecutionMessage: React.FC<Props> = ({ execution }) => {
  const executionPrompts = execution && "data" in execution ? execution.data : execution?.prompt_executions;
  const [prompts, setPrompts] = useState<DisplayPrompt[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    scrollContainerRef.current?.scrollIntoView({
      block: "end",
      behavior: "auto",
    });
  }, [execution]);

  return (
    <Box
      sx={{
        my: "20px",
        px: { xs: "8px", md: "40px" },
        overflowY: "auto",
        overflowX: "hidden",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          width: { xs: "4px", md: "6px" },
          p: 1,
          backgroundColor: "surface.1",
        },
        "&::-webkit-scrollbar-track": {
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "surface.5",
          outline: "1px solid surface.1",
          borderRadius: "10px",
        },
      }}
    >
      <Stack
        gap={1}
        sx={{
          width: { md: "calc(100% - 32px)" },
          p: { xs: "32px 8px 10px 8px", md: "8px 16px 8px 24px" },
          bgcolor: "surface.2",
          borderRadius: "0px 16px 16px 16px",
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
      <div ref={scrollContainerRef}></div>
    </Box>
  );
};
