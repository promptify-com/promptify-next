import React, { useEffect, useState, createRef, RefObject } from "react";
import Error from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { useAppSelector } from "@/hooks/useStore";
import type { Prompts } from "@/core/api/dto/prompts";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import type { IAnswer } from "@/components/Prompt/Types/chat";
import type { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";
import ExecutionContentPreview from "./VariantA/ExecutionContentPreview";
import { isImageOutput } from "./Utils";
import ImagePopup from "@/components/dialog/ImagePopup";
import Collapse from "@mui/material/Collapse";
import { ExecutionContent } from "@/components/common/ExecutionContent";

interface Props {
  execution: PromptLiveResponse | TemplatesExecutions | null;
  promptsData: Prompts[];
  answers?: IAnswer[];
  showPreview: boolean;
}

export const ExecutionCard: React.FC<Props> = ({ execution, promptsData, answers, showPreview }) => {
  const executionPrompts = execution && "data" in execution ? execution.data : execution?.prompt_executions;
  const sparkHashQueryParam = useAppSelector(state => state.executions?.sparkHashQueryParam ?? null);
  const [sortedPrompts, setSortedPrompts] = useState<DisplayPrompt[]>([]);
  const [elementRefs, setElementRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const documentTitle = useAppSelector(state => state.documents?.title);
  const promptsOrderMap: { [key: string]: number } = {};
  const promptsExecutionOrderMap: { [key: string]: number } = {};
  const promptOutputMap: { [key: string]: string } = {};

  promptsData?.forEach(prompt => {
    promptsOrderMap[prompt.id] = prompt.order;
    promptsExecutionOrderMap[prompt.id] = prompt.execution_priority;
    promptOutputMap[prompt.prompt_output_variable] =
      (execution as TemplatesExecutions).prompt_executions?.find(promptExec => promptExec.prompt === prompt.id)
        ?.output ?? "";
  });

  useEffect(() => {
    setElementRefs(elementRefs =>
      Array.from({ length: sortedPrompts.length }, (_, i) => elementRefs[i] || createRef<HTMLDivElement>()),
    );
  }, [sortedPrompts.length]);

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
      gap={3}
      sx={{
        p: "48px",
      }}
    >
      {execution && "title" in execution && (
        <Typography
          sx={{
            fontSize: { xs: 30, md: 48 },
            fontWeight: 400,
            color: "onSurface",
            wordBreak: "break-word",
          }}
        >
          {documentTitle ?? execution.title}
        </Typography>
      )}
      {execution && (
        <Stack
          direction={{ md: "row" }}
          justifyContent={"space-between"}
        >
          <Stack gap={3}>
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
                    <React.Fragment key={index}>
                      <Collapse in={showPreview}>
                        <ExecutionContentPreview
                          prompt={prompt}
                          answers={answers}
                          execution={execution as TemplatesExecutions}
                          promptOutputMap={promptOutputMap}
                        />
                      </Collapse>
                      <Stack
                        gap={1}
                        sx={{ pb: "24px" }}
                      >
                        {/* is Text Output */}
                        {!isImageOutput(exec.content, engineType) && (
                          <Stack
                            direction={"row"}
                            alignItems={"start"}
                            gap={{ md: 2 }}
                          >
                            <Stack
                              ref={elementRefs[index]}
                              direction={{ md: "row" }}
                              gap={2}
                              width={"100%"}
                            >
                              {isPrevItemImage && (
                                <Box
                                  component={"img"}
                                  alt={"book cover"}
                                  src={prevItem.content}
                                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).src = require("@/assets/images/default-thumbnail.jpg");
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
                              <ExecutionContent content={sanitizeHTML(exec.content)} />
                            </Stack>
                          </Stack>
                        )}
                        {/* is Image Output and Next item is not text */}
                        {isImageOutput(exec.content, engineType) && !isNextItemText && (
                          <>
                            <Box
                              component={"img"}
                              alt={"Promptify"}
                              src={exec.content}
                              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                (e.target as HTMLImageElement).src = require("@/assets/images/default-thumbnail.jpg");
                              }}
                              onClick={() => setPopupOpen(true)}
                              sx={{
                                borderRadius: "8px",
                                width: "40%",
                                objectFit: "cover",
                                float: "right",
                                ml: "20px",
                                mb: "10px",
                                cursor: "pointer",
                              }}
                            />
                            <ImagePopup
                              open={popupOpen}
                              imageUrl={exec.content}
                              onClose={() => setPopupOpen(false)}
                            />
                          </>
                        )}
                      </Stack>
                    </React.Fragment>
                  );
                }
              })
            ) : (
              <Typography>
                We could not display the selected execution as it&apos;s missing some information!
              </Typography>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
