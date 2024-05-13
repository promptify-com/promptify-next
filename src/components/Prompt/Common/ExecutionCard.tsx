import { useEffect, useRef, useState } from "react";
import Error from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { Subtitle } from "@/components/blocks";
import { useAppSelector } from "@/hooks/useStore";
import { isImageOutput } from "@/components/Prompt/Utils";
import ImagePopup from "@/components/dialog/ImagePopup";
import type { Prompts } from "@/core/api/dto/prompts";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import type { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionContent } from "@/components/common/ExecutionContent";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import { alpha } from "@mui/material";
import { theme } from "@/theme";

interface Props {
  execution: PromptLiveResponse | TemplatesExecutions | null;
  promptsData: Prompts[];
}

export const ExecutionCard: React.FC<Props> = ({ execution, promptsData }) => {
  const isStreaming = execution && "data" in execution;
  const executionPrompts = isStreaming ? execution.data : execution?.prompt_executions;
  const sparkHashQueryParam = useAppSelector(state => state.executions.sparkHashQueryParam);
  const showPreview = useAppSelector(state => state.template.showPromptsView);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    containerRef: carouselRef,
    scrollNext,
    scrollPrev,
    canScrollNext,
    canScrollPrev,
    scrollTo,
    selectedSlide,
    totalSlides,
  } = useCarousel({ autoHeight: !isStreaming, options: { loop: false, dragFree: false } });

  const [sortedPrompts, setSortedPrompts] = useState<DisplayPrompt[]>([]);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

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
  const prevTotalSlidesRef = useRef<number>(totalSlides);

  useEffect(() => {
    const isNewSlideCreated = prevTotalSlidesRef.current !== totalSlides;
    if (isStreaming && isNewSlideCreated) {
      const wasOnLastSlide = selectedSlide === prevTotalSlidesRef.current - 1;
      if (wasOnLastSlide) scrollTo(totalSlides - 1);
      prevTotalSlidesRef.current = totalSlides;
    }
  }, [totalSlides]);

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
        p: { xs: "16px", md: "24px" },
        width: { xs: "calc(100% - 32px)", md: "calc(100% - 48px)" },
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
          {!isStreaming ? execution.title : "Untitled"}
        </Typography>
      )}
      {execution && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          p={{ xs: !isStreaming ? "10px 0px" : "20px 0px", md: 0 }}
        >
          <Box
            ref={carouselRef}
            overflow={"hidden"}
          >
            <Stack
              ref={carouselContainerRef}
              direction={"row"}
              alignItems={"flex-start"}
              gap={3}
            >
              {!!sortedPrompts.length ? (
                sortedPrompts?.map((exec, index) => {
                  const prompt = promptsData.find(prompt => prompt.id === exec.prompt);
                  const engineType = prompt?.engine?.output_type ?? "TEXT";
                  const isImage = isImageOutput(exec.content, engineType);
                  const prevItem = sortedPrompts[index - 1];
                  const isPrevItemImage = isImageOutput(sortedPrompts[index - 1]?.content);
                  const isNextItemText = !isImageOutput(sortedPrompts[index + 1]?.content);

                  const renderImagePrompt = isImage && !isNextItemText;
                  const renderTextImagePrompt = !isImage && isPrevItemImage;

                  if (isImage && isNextItemText) return null;

                  if (prompt?.show_output || sparkHashQueryParam) {
                    return (
                      <Stack
                        key={index}
                        gap={1}
                        minWidth={"100%"}
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
                        {renderTextImagePrompt ? (
                          <Stack
                            direction={"row"}
                            alignItems={"start"}
                            gap={{ md: 2 }}
                          >
                            <Stack
                              display={{ xs: showPreview ? "none" : "flex", md: "flex" }}
                              width={{ md: showPreview ? "65%" : "100%" }}
                              direction={{ md: "row" }}
                              gap={2}
                            >
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
                                }}
                              />
                              <ExecutionContent content={sanitizeHTML(exec.content)} />
                            </Stack>
                          </Stack>
                        ) : renderImagePrompt ? (
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
                                display: { xs: showPreview ? "none" : "block", md: "block" },
                                borderRadius: "8px",
                                width: "40%",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                            />

                            <ImagePopup
                              open={popupOpen}
                              imageUrl={exec.content}
                              onClose={() => setPopupOpen(false)}
                            />
                          </>
                        ) : (
                          <Stack
                            direction={"row"}
                            alignItems={"start"}
                            gap={{ md: 2 }}
                          >
                            <Stack
                              display={{ xs: showPreview ? "none" : "flex", md: "flex" }}
                              width={{ md: showPreview ? "65%" : "100%" }}
                              direction={{ md: "row" }}
                              gap={2}
                            >
                              <ExecutionContent content={sanitizeHTML(exec.content)} />
                            </Stack>
                          </Stack>
                        )}
                      </Stack>
                    );
                  }
                })
              ) : (
                <Typography>We could not display the selected execution as it's missing some information!</Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      )}
      {totalSlides > 1 && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={1}
          sx={{
            position: "sticky",
            bottom: 0,
            bgcolor: "surface.1",
            width: "fit-content",
            ml: "auto",
            px: "8px",
            borderRadius: "8px",
          }}
        >
          <CarouselButtons
            scrollNext={scrollNext}
            scrollPrev={scrollPrev}
            canScrollNext={canScrollNext}
            canScrollPrev={canScrollPrev}
            containerStyle={{
              width: "150px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            buttonStyle={{
              color: alpha(theme.palette.secondary.light, 0.6),
            }}
          >
            <Typography
              fontSize={14}
              fontWeight={400}
              color={alpha(theme.palette.secondary.light, 0.7)}
            >
              {selectedSlide + 1} of {totalSlides}
            </Typography>
          </CarouselButtons>
        </Stack>
      )}
    </Stack>
  );
};
