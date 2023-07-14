import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Subtitle } from "@/components/blocks";
import { getMarkdownFromString } from "@/common/helpers/getMarkdownFromString";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  execution: PromptLiveResponse;
  templateData: Templates;
}

export const ExecutionCardGenerated: React.FC<Props> = ({ execution, templateData }) => {

  const isImageOutput = (output: string): boolean => {
    return (
      output.endsWith(".png") ||
      output.endsWith(".jpg") ||
      output.endsWith(".jpeg") ||
      output.endsWith(".webp")
    );
  };

  return (
    <Stack gap={1}
      sx={{
        width: "70%",
        mx: "auto",
      }}
    >
      {execution.data?.map((exec, i) => {
        const prompt = templateData.prompts.find(
          (prompt) => prompt.id === exec.prompt
        );
        if (prompt?.show_output)
          return (
            <Stack key={i}
              gap={1}
              sx={{ py: "24px" }}
            >
              <Subtitle sx={{ fontSize: 24, fontWeight: 400, color: "onSurface" }}>
                {prompt.title}
              </Subtitle>
              {isImageOutput(exec.message) ? (
                <Box
                  component={"img"}
                  alt={"book cover"}
                  src={exec.message}
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    (e.target as HTMLImageElement).src =
                      "http://placehold.it/165x215";
                  }}
                  sx={{
                    borderRadius: "8px",
                    width: 165,
                    height: 215,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 400,
                    color: "onSurface",
                    wordWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: getMarkdownFromString(exec.message),
                  }}
                />
              )}
            </Stack>
          );
      })}
    </Stack>
  );
};