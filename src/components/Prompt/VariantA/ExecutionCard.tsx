import { useEffect, useState, createRef, RefObject } from "react";
import Error from "@mui/icons-material/Error";
import { keyframes } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";

import { isImageOutput, markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { Subtitle } from "@/components/blocks";
import { useAppSelector } from "@/hooks/useStore";
import type { Prompts } from "@/core/api/dto/prompts";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import type { IAnswer } from "@/common/types/chat";
import type { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";
import ExecutionContentPreview from "./ExecutionContentPreview";
import { FeedbackActions } from "./FeedbackActions";

interface Props {
  execution: PromptLiveResponse | TemplatesExecutions | null;
  promptsData: Prompts[];
  answers?: IAnswer[];
  showPreview: boolean;
}

export const ExecutionCard: React.FC<Props> = ({ execution, promptsData, answers, showPreview }) => {
  const executionPrompts = execution && "data" in execution ? execution.data : execution?.prompt_executions;
  const sparkHashQueryParam = useAppSelector(state => state.executions.sparkHashQueryParam);
  const [sortedPrompts, setSortedPrompts] = useState<DisplayPrompt[]>([]);
  const [elementRefs, setElementRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [elementHeights, setElementHeights] = useState<number[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const promptsOrderMap: { [key: string]: number } = {};
  const promptsExecutionOrderMap: { [key: string]: number } = {};

  promptsData?.forEach(prompt => {
    promptsOrderMap[prompt.id] = prompt.order;
    promptsExecutionOrderMap[prompt.id] = prompt.execution_priority;
  });

  useEffect(() => {
    setElementRefs(elementRefs =>
      Array.from({ length: sortedPrompts.length }, (_, i) => elementRefs[i] || createRef<HTMLDivElement>()),
    );
  }, [sortedPrompts.length]);

  useEffect(() => {
    setElementHeights(Array(sortedPrompts.length).fill(0));
    if (elementRefs.length === sortedPrompts.length) {
      setTimeout(() => {
        const heights = elementRefs.map(ref => ref.current?.offsetHeight ?? 0);
        setElementHeights(heights);
      }, 300);
    }
  }, [elementRefs, execution, promptsData]);

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
          const prompt = promptsData.find(prompt => prompt.id === exec.prompt)!;

          return {
            ...exec,
            content: !isImageOutput(_content, prompt.engine.output_type) ? await markdownToHTML(_content) : _content,
          };
        }),
      );

      setSortedPrompts(processedOutputs);
    };

    sortAndProcessExecutions();
  }, [executionPrompts]);

  const handleFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(""), 2000); // Hide message after 2 seconds
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
        width: { md: "80%" },
        m: { md: "auto" },
        p: { xs: "20px", md: "48px 0" },
      }}
    >
      {execution && "title" in execution && (
        <Typography
          sx={{
            fontSize: { xs: 30, md: 48 },
            fontWeight: 400,
            color: "onSurface",
            py: "24px",
            wordBreak: "break-word",
          }}
        >
          {execution.title}
        </Typography>
      )}
      {execution && (
        <Stack direction={{ md: "row" }}>
          <Stack gap={1}>
            {sortedPrompts?.map((exec, index) => {
              const prompt = promptsData.find(prompt => prompt.id === exec.prompt)!;
              const engineType = prompt.engine.output_type;
              const prevItem = sortedPrompts[index - 1];
              const isPrevItemImage = prevItem && isImageOutput(prevItem?.content, engineType);
              const nextItem = sortedPrompts[index + 1];
              const isNextItemText = nextItem && !isImageOutput(nextItem?.content, engineType);

              if (prompt?.show_output || sparkHashQueryParam) {
                return (
                  <Stack
                    key={index}
                    gap={1}
                    sx={{ pb: "24px" }}
                  >
                    {prompt && (
                      <Subtitle
                        sx={{
                          display: { xs: showPreview ? "none" : "block", md: "block" },
                          fontSize: { xs: 18, md: 24 },
                          fontWeight: 400,
                          color: "onSurface",
                        }}
                      >
                        {!isImageOutput(exec.content, engineType) && prompt?.title}
                        {exec.errors && executionError(exec.errors)}
                      </Subtitle>
                    )}
                    {/* is Text Output */}
                    {!isImageOutput(exec.content, engineType) && (
                      <Stack
                        direction={"row"}
                        alignItems={"start"}
                        gap={{ md: 2 }}
                      >
                        <Stack
                          ref={elementRefs[index]}
                          display={{ xs: showPreview ? "none" : "flex", md: "flex" }}
                          width={{ md: showPreview ? "65%" : "100%" }}
                          direction={{ md: "row" }}
                          gap={2}
                        >
                          {isPrevItemImage && (
                            <Box
                              component={"img"}
                              alt={"book cover"}
                              src={prevItem.content}
                              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                (e.target as HTMLImageElement).src = require("@/assets/images/default-thumbnail.jpg");
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

                        <Stack
                          flex={1}
                          mt={{ md: -7 }}
                          sx={{
                            width: { xs: showPreview ? "100%" : 0, md: showPreview ? "35%" : 0 },
                            height: { xs: showPreview ? "fit-content" : 0, md: "fit-content" },
                            maxHeight: { md: showPreview ? elementHeights[index] : 0 },
                            py: 2,
                            pl: showPreview ? "10px" : 0,
                            borderLeft: showPreview ? "2px solid #ECECF4" : "none",
                            overflow: "auto",
                            animation: `${showPreview ? expandAnimation : collapseAnimation} 300ms forwards`,
                            "&::-webkit-scrollbar": {
                              width: "6px",
                              p: 1,
                              bgcolor: "surface.1",
                            },
                            "&::-webkit-scrollbar-track": {
                              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              bgcolor: "surface.1",
                              outline: "1px solid surface.1",
                              borderRadius: "10px",
                            },
                          }}
                        >
                          <ExecutionContentPreview
                            id={index + 1}
                            prompt={prompt}
                            answers={answers}
                            execution={execution as TemplatesExecutions}
                          />
                        </Stack>
                      </Stack>
                    )}
                    {/* is Image Output and Next item is not text */}
                    {isImageOutput(exec.content, engineType) && !isNextItemText && (
                      <Box
                        component={"img"}
                        alt={"book cover"}
                        src={exec.content}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          (e.target as HTMLImageElement).src = require("@/assets/images/default-thumbnail.jpg");
                        }}
                        sx={{
                          display: { xs: showPreview ? "none" : "block", md: "block" },
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
          {"title" in execution && (
            <Box
              sx={{
                height: "fit-content",
                position: "sticky",
                top: "50px",
                mr: { md: "-50px" },
                ml: { md: "20px" },
              }}
            >
              <FeedbackActions
                execution={execution}
                onFeedbackGiven={handleFeedback}
                vertical
                min
              />
            </Box>
          )}
        </Stack>
      )}
      {feedbackMessage && (
        <Stack
          gap={1}
          direction={"row"}
          alignItems={"center"}
          sx={{
            bgcolor: "primary.main",
            position: "fixed",
            top: "240px",
            right: "40%",

            color: "white",
            p: 1,
            borderRadius: "16px",
            fontSize: 12,
          }}
        >
          <CheckCircle sx={{ fontSize: 16 }} />
          {feedbackMessage}
        </Stack>
      )}
    </Stack>
  );
};

const expandAnimation = keyframes`
  from { width: 0%; }
  to { width: 20%; }
`;

const collapseAnimation = keyframes`
  from { width: 20%; }
  to { width: 0%; }
`;
