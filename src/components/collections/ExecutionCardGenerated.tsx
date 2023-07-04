import React from "react";
import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Subtitle } from "@/components/blocks";
import { getMarkdownFromString } from "@/common/helpers/getMarkdownFromString";
import moment from "moment";
import { PromptLiveResponse } from "@/common/types/prompt";
import { Templates } from "@/core/api/dto/templates";
import PromptifyLogo from "@/assets/images/promptify.png";
import Image from "next/image";

interface Props {
  execution: PromptLiveResponse;
  templateData: Templates;
}

export const ExecutionCardGenerated: React.FC<Props> = ({
  execution,
  templateData,
}) => {
  const { palette } = useTheme();

  const isImageOutput = (output: string): boolean => {
    return (
      output.endsWith(".png") ||
      output.endsWith(".jpg") ||
      output.endsWith(".jpeg") ||
      output.endsWith(".webp")
    );
  };

  return (
    <Stack direction={"row"} spacing={{ xs: 0, md: 2 }} sx={{ py: "20px" }}>
      <Box display={{ xs: 'none', md: 'inline-flex' }}>
        <Image
          src={PromptifyLogo}
          alt={"alt"}
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: "50%",
            marginTop: "16px",
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          borderRadius: "16px",
          bgcolor: alpha(palette.surface[4], 0.6),
          p: "16px",
        }}
      >
        <Stack direction={"row"} alignItems={"center"} gap={1} mb={"20px"}>
          <Box display={{ xs: 'inline-flex', md: 'none' }}>
            <Image
              src={PromptifyLogo}
              alt={"alt"}
              style={{
                width: 24,
                height: 24,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Typography fontWeight={400} color={"onSurface"}>
            Promptify
          </Typography>
          <Typography fontWeight={400} color={"grey.600"}>
            {moment(execution.created_at).fromNow()}
          </Typography>
        </Stack>

        {execution.data?.map((exec, i) => {
          const prompt = templateData.prompts.find(
            (prompt) => prompt.id === exec.prompt
          );
          if (prompt?.show_output)
            return (
              <Box key={i} sx={{ mb: "30px" }}>
                <Subtitle sx={{ mb: "12px", color: "tertiary", fontSize: 12 }}>
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
                    color={"onSurface"}
                    fontSize={14}
                    dangerouslySetInnerHTML={{
                      __html: getMarkdownFromString(exec.message),
                    }}
                  />
                )}
              </Box>
            );
        })}
      </Box>
    </Stack>
  );
};
