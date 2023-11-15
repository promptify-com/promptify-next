import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { Subtitle } from "@/components/blocks";
import { Error } from "@mui/icons-material";
import { isImageOutput, markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";
import { Prompts } from "@/core/api/dto/prompts";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  execution: PromptLiveResponse | TemplatesExecutions | null;
  promptsData: Prompts[];
}

export const ExecutionCard: React.FC<Props> = ({ execution, promptsData }) => {
  const executionPrompts = execution && "data" in execution ? execution.data : execution?.prompt_executions;
  const sparkHashQueryParam = useAppSelector(state => state.executions.sparkHashQueryParam);
  const isGenerating = useSelector((state: RootState) => state.template.isGenerating);
  const [sortedPrompts, setSortedPrompts] = useState<DisplayPrompt[]>([]);

  const promptsOrderMap: { [key: string]: number } = {};
  const promptsExecutionOrderMap: { [key: string]: number } = {};

  promptsData?.forEach(prompt => {
    promptsOrderMap[prompt.id] = prompt.order;
    promptsExecutionOrderMap[prompt.id] = prompt.execution_priority;
  });

  useEffect(() => {
    const sortAndProcessExecutions = async () => {
      const sortedByPrompts = [...(executionPrompts || [])].sort((a, b) => {
        if (promptsOrderMap[a.prompt] === promptsOrderMap[b.prompt]) {
          return promptsExecutionOrderMap[a.prompt] - promptsExecutionOrderMap[b.prompt];
        }
        return promptsOrderMap[a.prompt] - promptsOrderMap[b.prompt];
      });

      const processedOutputs = await Promise.all(
        sortedByPrompts.map(async exec => {
          const _content = "message" in exec ? exec.message : exec.output;
          return {
            ...exec,
            content: !isImageOutput(_content) ? await markdownToHTML(_content) : _content,
          };
        }),
      );

      setSortedPrompts(processedOutputs);
    };

    sortAndProcessExecutions();
  }, [executionPrompts]);

  const scrollRef = useRef<HTMLDivElement>(null);

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
        m: { md: "20px auto" },
      }}
    >
      {!isGenerating && <div ref={scrollRef}></div>}

      {execution && "title" in execution && (
        <Typography sx={{ fontSize: 48, fontWeight: 400, color: "onSurface", py: "24px" }}>
          {execution.title}
        </Typography>
      )}
      {execution &&
        sortedPrompts?.map((exec, index) => {
          const prevItem = sortedPrompts[index - 1];
          const isPrevItemImage = prevItem && isImageOutput(prevItem?.content);
          const nextItem = sortedPrompts[index + 1];
          const isNextItemText = nextItem && !isImageOutput(nextItem?.content);
          const prompt = promptsData.find(prompt => prompt.id === exec.prompt);

          if (prompt?.show_output || sparkHashQueryParam) {
            return (
              <Stack
                key={index}
                gap={1}
                sx={{ pb: "24px" }}
              >
                {prompt && (
                  <Subtitle sx={{ fontSize: 24, fontWeight: 400, color: "onSurface" }}>
                    {!isImageOutput(exec.content) && prompt?.title}
                    {exec.errors && executionError(exec.errors)}
                  </Subtitle>
                )}
                {/* is Text Output */}
                {!isImageOutput(exec.content) && (
                  <Box>
                    {isPrevItemImage && (
                      <Box
                        component={"img"}
                        alt={"book cover"}
                        src={prevItem.content}
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
                    <Box
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
                  </Box>
                )}
                {/* is Image Output and Next item is not text */}
                {isImageOutput(exec.content) && !isNextItemText && (
                  <Box
                    component={"img"}
                    alt={"book cover"}
                    src={exec.content}
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

      {isGenerating && <div ref={scrollRef}></div>}
    </Stack>
  );
};
