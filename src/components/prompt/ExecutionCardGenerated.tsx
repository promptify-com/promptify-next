import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Subtitle } from "@/components/blocks";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers";
import { PromptLiveResponse, PromptLiveResponseData } from "@/common/types/prompt";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  execution: PromptLiveResponse;
  templateData: Templates;
}

export const ExecutionCardGenerated: React.FC<Props> = ({ execution, templateData }) => {
  const [liveExecutionData, setLiveExecutionData] = useState<PromptLiveResponseData[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sortAndProcessExecutions = async () => {
      if (execution.data) {
        const processedOutputs = await Promise.all(
          execution.data.map(async liveResponseData => {
            return {
              ...liveResponseData,
              message: !isImageOutput(liveResponseData.message)
                ? await markdownToHTML(liveResponseData.message)
                : liveResponseData.message,
            };
          }),
        );
        setLiveExecutionData(processedOutputs);
      }
    };

    sortAndProcessExecutions();
  }, [execution.data]);

  useEffect(() => {
    document.addEventListener("wheel", event => {
      if (event.deltaY < 0) {
        clearInterval(interval);
      }
    });

    function updateScroll() {
      ref.current?.scrollIntoView({
        block: "end",
      });
    }
    const interval = setInterval(updateScroll, 100);

    return () => clearInterval(interval);
  }, []);

  const isImageOutput = (output: string): boolean => {
    return output.endsWith(".png") || output.endsWith(".jpg") || output.endsWith(".jpeg") || output.endsWith(".webp");
  };

  return (
    <Stack
      gap={1}
      sx={{
        width: { md: "70%" },
        mx: "auto",
      }}
    >
      {liveExecutionData.map((exec, i) => {
        const prevItem = i > 0 && execution.data && execution.data[i - 1];
        const isPrevItemIsImage = prevItem && isImageOutput(prevItem?.message);
        const nextItem = execution.data ? i < execution.data.length - 1 && execution.data[i + 1] : undefined;
        const isNextItemIsText = nextItem && !isImageOutput(nextItem?.message);

        const prompt = templateData.prompts.find(prompt => prompt.id === exec.prompt);
        if (prompt?.show_output)
          return (
            <Stack
              key={i}
              gap={1}
              sx={{ py: "24px" }}
            >
              <Subtitle sx={{ fontSize: 24, fontWeight: 400, color: "onSurface" }}>{prompt.title}</Subtitle>
              {!isImageOutput(exec.message) && (
                <Box>
                  {isPrevItemIsImage && (
                    <Box
                      component={"img"}
                      alt={"book cover"}
                      src={prevItem.message}
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
                      __html: sanitizeHTML(exec.message),
                    }}
                  />
                </Box>
              )}
              {/* is Image Output and Next item is not text */}
              {isImageOutput(exec.message) && !isNextItemIsText && (
                <Box>
                  <Box
                    component={"img"}
                    alt={"book cover"}
                    src={exec.message}
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
                </Box>
              )}
            </Stack>
          );
      })}
      <div ref={ref} />
    </Stack>
  );
};
