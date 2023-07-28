import React, { useEffect, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Subtitle } from "@/components/blocks";
import { getMarkdownFromString } from "@/common/helpers/getMarkdownFromString";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  execution: PromptLiveResponse;
  templateData: Templates;
}

export const ExecutionCardGenerated: React.FC<Props> = ({
  execution,
  templateData,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("wheel", (event) => {
      clearInterval(interval);
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
    return (
      output.endsWith(".png") ||
      output.endsWith(".jpg") ||
      output.endsWith(".jpeg") ||
      output.endsWith(".webp")
    );
  };

  return (
    <Stack
      gap={1}
      sx={{
        width: "70%",
        mx: "auto",
      }}
    >
      {execution.data?.map((exec, i) => {
        const prevItem = i > 0 && execution.data && execution.data[i - 1];
        const isPrevItemIsImage = prevItem && isImageOutput(prevItem?.message);

        const prompt = templateData.prompts.find(
          (prompt) => prompt.id === exec.prompt
        );
        if (prompt?.show_output)
          return (
            <Stack key={i} gap={1} sx={{ py: "24px" }}>
              <Subtitle
                sx={{ fontSize: 24, fontWeight: 400, color: "onSurface" }}
              >
                {prompt.title}
              </Subtitle>
              {!isImageOutput(exec.message) && (
                <Box>
                  {isPrevItemIsImage && (
                    <Box
                      component={"img"}
                      alt={"book cover"}
                      src={prevItem.message}
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        (e.target as HTMLImageElement).src =
                          "http://placehold.it/165x215";
                      }}
                      sx={{
                        borderRadius: "8px",
                        width: '40%',
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
                    }}
                    dangerouslySetInnerHTML={{
                      __html: getMarkdownFromString(exec.message),
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
