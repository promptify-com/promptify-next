import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Subtitle } from "@/components/blocks";
import { markdownToHTML } from "@/common/helpers/markdownToHTML";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  execution: PromptLiveResponse;
  templateData: Templates;
}

export const ExecutionCardGenerated: React.FC<Props> = ({ execution, templateData }) => {
  const isImageOutput = (output: string): boolean => {
    return output.endsWith(".png") || output.endsWith(".jpg") || output.endsWith(".jpeg") || output.endsWith(".webp");
  };

  let floatImageSrc = "";

  return (
    <Stack
      gap={1}
      sx={{
        width: "70%",
        mx: "auto",
      }}
    >
      {execution.data?.map((exec, i) => {
        const prompt = templateData.prompts.find(prompt => prompt.id === exec.prompt);
        if (prompt?.show_output) {
          if (isImageOutput(exec.message)) {
            floatImageSrc = exec.message;
            return null;
          }
          return (
            <Stack
              key={i}
              gap={1}
              sx={{ py: "24px" }}
            >
              <Subtitle sx={{ fontSize: 24, fontWeight: 400, color: "onSurface" }}>{prompt.title}</Subtitle>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 400,
                  color: "onSurface",
                  wordWrap: "break-word",
                  position: "relative",
                }}
              >
                {floatImageSrc && (
                  <Box
                    component={"img"}
                    alt={"Output Image"}
                    src={floatImageSrc}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      (e.target as HTMLImageElement).src = "http://placehold.it/165x215";
                    }}
                    sx={{
                      borderRadius: "8px",
                      width: 165,
                      height: 215,
                      objectFit: "cover",
                      float: "left",
                      mr: "16px",
                    }}
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: exec.message,
                  }}
                />
              </Typography>
            </Stack>
          );
        }
        return null;
      })}
    </Stack>
  );
};
