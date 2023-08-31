import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { PromptExecutions, Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { Subtitle } from "@/components/blocks";
import { Error } from "@mui/icons-material";
import { markdownToHTML } from "@/common/helpers";
import DOMPurify from "isomorphic-dompurify";

interface Props {
  execution: TemplatesExecutions;
  templateData: Templates;
  search: string;
}

export const ExecutionCard: React.FC<Props> = ({ execution, templateData, search }) => {
  const [sortedExecutions, setSortedExecutions] = useState<PromptExecutions[]>([]);

  const promptsOrderMap: { [key: string]: number } = {};
  const promptsExecutionOrderMap: { [key: string]: number } = {};

  templateData.prompts.forEach(prompt => {
    promptsOrderMap[prompt.id] = prompt.order;
    promptsExecutionOrderMap[prompt.id] = prompt.execution_priority;
  });

  useEffect(() => {
    const sortAndProcessExecutions = async () => {
      const sortedByPrompts = [...(execution.prompt_executions || [])].sort((a, b) => {
        if (promptsOrderMap[a.prompt] === promptsOrderMap[b.prompt]) {
          return promptsExecutionOrderMap[a.prompt] - promptsExecutionOrderMap[b.prompt];
        }
        return promptsOrderMap[a.prompt] - promptsOrderMap[b.prompt];
      });

      const processedOutputs = await Promise.all(
        sortedByPrompts.map(async exec => {
          return {
            ...exec,
            output: !isImageOutput(exec.output) ? await markdownToHTML(exec.output) : exec.output,
          };
        }),
      );

      setSortedExecutions(processedOutputs);
    };

    sortAndProcessExecutions();
  }, [execution.prompt_executions]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      block: "end",
    });
  }, [execution]);

  const isImageOutput = (output: string): boolean => {
    return output.endsWith(".png") || output.endsWith(".jpg") || output.endsWith(".jpeg") || output.endsWith(".webp");
  };

  const executionError = (error: string | undefined) => {
    return (
      <Tooltip
        title={error}
        placement="right"
        arrow
        componentsProps={{
          tooltip: {
            sx: { bgcolor: "error.main", color: "onError", fontSize: 10, fontWeight: 500 },
          },
          arrow: {
            sx: { color: "error.main" },
          },
        }}
      >
        <Error sx={{ color: "error.main", width: 20, height: 20 }} />
      </Tooltip>
    );
  };

  return (
    <Stack
      gap={1}
      sx={{
        width: { md: "70%" },
        mx: "auto",
      }}
    >
      <div ref={scrollRef}></div>
      <Typography sx={{ fontSize: 48, fontWeight: 400, color: "onSurface", py: "24px" }}>{execution.title}</Typography>
      {sortedExecutions?.map((exec, index) => {
        const prevItem = index > 0 && sortedExecutions[index - 1];
        const isPrevItemIsImage = prevItem && isImageOutput(prevItem?.output);
        const nextItem = index < sortedExecutions.length - 1 && sortedExecutions[index + 1];
        const isNextItemIsText = nextItem && !isImageOutput(nextItem?.output);
        const prompt = templateData.prompts.find(prompt => prompt.id === exec.prompt);

        if (prompt?.show_output) {
          return (
            <Stack
              key={exec.id}
              gap={1}
              sx={{ py: "24px" }}
            >
              <Subtitle sx={{ fontSize: 24, fontWeight: 400, color: "onSurface" }}>
                {prompt.title}
                {exec.errors && executionError(exec.errors)}
              </Subtitle>
              {/* is Text Output */}
              {!isImageOutput(exec.output) && (
                <Box>
                  {isPrevItemIsImage && (
                    <Box
                      component={"img"}
                      alt={"book cover"}
                      src={prevItem.output}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = "http://placehold.it/165x215";
                      }}
                      sx={{
                        borderRadius: "8px",
                        width: "40%",
                        objectFit: "cover",
                        float: "right",
                        ml: "20px",
                        mb: "10px",
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontSize: 15,
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
                        bgcolor: "#282a35",
                        color: "common.white",
                        m: "10px 0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        code: {
                          display: "block",
                          p: "16px 24px",
                          overflow: "auto",
                        },
                        ".language": {
                          p: "8px 24px",
                          bgcolor: "#4d5562",
                          color: "#ffffff",
                          fontSize: 13,
                        },
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(exec.output),
                    }}
                  />
                </Box>
              )}
              {/* is Image Output and Next item is not text */}
              {isImageOutput(exec.output) && !isNextItemIsText && (
                <Box
                  component={"img"}
                  alt={"book cover"}
                  src={exec.output}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    (e.target as HTMLImageElement).src = "http://placehold.it/165x215";
                  }}
                  sx={{
                    borderRadius: "8px",
                    width: "40%",
                    objectFit: "cover",
                    float: "right",
                    ml: "20px",
                    mb: "10px",
                  }}
                />
              )}
            </Stack>
          );
        }
      })}
    </Stack>
  );
};
