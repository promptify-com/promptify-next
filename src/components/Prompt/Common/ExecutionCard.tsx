import { useEffect, useState, createRef, RefObject } from "react";
import Error from "@mui/icons-material/Error";
import { keyframes } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { Subtitle } from "@/components/blocks";
import { useAppSelector } from "@/hooks/useStore";
import type { Prompts } from "@/core/api/dto/prompts";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import type { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";
import PromptContent from "./PromptContent";
import FeedbackThumbs from "./FeedbackThumbs";
import { isImageOutput } from "../Utils";

interface Props {
  execution: PromptLiveResponse | TemplatesExecutions | null;
  promptsData: Prompts[];
}

export const ExecutionCard: React.FC<Props> = ({ execution, promptsData }) => {
  const executionPrompts = execution && "data" in execution ? execution.data : execution?.prompt_executions;
  const sparkHashQueryParam = useAppSelector(state => state.executions.sparkHashQueryParam);
  const showPreview = useAppSelector(state => state.template.showPromptsView);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const [sortedPrompts, setSortedPrompts] = useState<DisplayPrompt[]>([]);
  const [elementRefs, setElementRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [elementHeights, setElementHeights] = useState<number[]>([]);

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
          const prompt = promptsData.find(prompt => prompt.id === exec.prompt);

          return {
            ...exec,
            content: !isImageOutput(_content, prompt?.engine?.output_type ?? "TEXT")
              ? await markdownToHTML(_content)
              : _content,
          };
        }),
      );

      setSortedPrompts(processedOutputs);
    };

    sortAndProcessExecutions();
  }, [executionPrompts]);

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
        width: { md: "90%" },
      }}
    >
      {execution && (
        <Typography
          sx={{
            fontSize: { xs: 30, md: 48 },
            fontWeight: 400,
            color: "onSurface",
            py: "24px",
            wordBreak: "break-word",
          }}
        >
          {"title" in execution ? execution.title : "Untitled"}
        </Typography>
      )}
      {execution && (
        <Stack
          direction={{ md: "row" }}
          p={{ xs: "title" in execution ? "10px 0px" : "20px 0px", md: 0 }}
        >
          <Stack gap={1}>
            {!!sortedPrompts.length ? (
              sortedPrompts?.map((exec, index) => {
                const prompt = promptsData.find(prompt => prompt.id === exec.prompt);
                const engineType = prompt?.engine?.output_type ?? "TEXT";
                const prevItem = sortedPrompts[index - 1];
                const isPrevItemImage = prevItem && isImageOutput(prevItem?.content, engineType);
                const nextItem = sortedPrompts[index + 1];
                const isNextItemText = nextItem && !isImageOutput(nextItem?.content, engineType);

                if (prompt?.show_output || sparkHashQueryParam) {
                  return (
                    <Stack
                      key={index}
                      gap={1}
                      sx={{ pb: "0px" }}
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
                            <PromptContent
                              id={index + 1}
                              content={prompt?.content ?? ""}
                              engineName={prompt?.engine?.name ?? ""}
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
              })
            ) : (
              <Typography>We could not display the selected execution as it's missing some information!</Typography>
            )}
          </Stack>
          {selectedExecution && "title" in selectedExecution && (
            <Box
              sx={{
                height: "fit-content",
                display: { md: "none" },
                position: "sticky",
                top: "50px",
                mr: { md: "-50px" },
                ml: { md: "20px" },
              }}
            >
              <FeedbackThumbs
                variant="icon"
                execution={selectedExecution}
                vertical
              />
            </Box>
          )}
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
