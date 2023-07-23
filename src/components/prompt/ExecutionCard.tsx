import React from "react";
import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { Subtitle } from "@/components/blocks";
import { getMarkdownFromString } from "@/common/helpers/getMarkdownFromString";

interface Props {
  execution: TemplatesExecutions;
  templateData: Templates;
}

export const ExecutionCard: React.FC<Props> = ({ execution, templateData }) => {

  const promptsOrderMap: { [key: string]: number } = {};
  const promptsExecutionOrderMap: { [key: string]: number } = {};

  templateData.prompts.forEach((prompt) => {
    promptsOrderMap[prompt.id] = prompt.order;
    promptsExecutionOrderMap[prompt.id] = prompt.execution_priority;
  });

  const sortedExecutions = [...execution.prompt_executions].sort((a, b) => {
    if (promptsOrderMap[a.prompt] === promptsOrderMap[b.prompt]) {
      console.log(promptsExecutionOrderMap[a.prompt], promptsExecutionOrderMap[b.prompt]);
      return promptsExecutionOrderMap[a.prompt] - promptsExecutionOrderMap[b.prompt];
    }
    return promptsOrderMap[a.prompt] - promptsOrderMap[b.prompt];
  });

  const isImageOutput = (output: string): boolean => {
    return (
      output.endsWith(".png") ||
      output.endsWith(".jpg") ||
      output.endsWith(".jpeg") ||
      output.endsWith(".webp")
    );
  };

  const copyFormattedOutput = async () => {
    let copyHTML = "";
    for (const exec of execution.prompt_executions) {
      const prompt = templateData.prompts.find(
        (prompt) => prompt.id === exec.prompt
      );
      if (prompt?.show_output) {
        copyHTML += "<h2>" + prompt.title + "</h2>";
        if (isImageOutput(exec.output)) {
          copyHTML += '<img src="' + exec.output + '" alt="Image output"/>';
        } else {
          copyHTML += "<p>" + exec.output + "</p>";
        }
        copyHTML += "<br/>";
      }
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([copyHTML], { type: "text/html" }),
        }),
      ]);
    } catch (err) {
      console.error("Failed to copy HTML: ", err);
    }
  };

  return (
    <Stack gap={1}
      sx={{
        width: "70%",
        mx: "auto",
      }}
    >
      <Typography sx={{ fontSize: 48, fontWeight: 400, color: "onSurface", py: "24px" }}>
        {execution.title}
      </Typography>
      {sortedExecutions?.map((exec) => {
        const prompt = templateData.prompts.find(
          (prompt) => prompt.id === exec.prompt
        );
        if (prompt?.show_output)
          return (
            <Stack key={exec.id}
              gap={1}
              sx={{ py: "24px" }}
            >
              <Subtitle sx={{ fontSize: 24, fontWeight: 400, color: "onSurface" }}>
                {prompt.title}
              </Subtitle>
              {isImageOutput(exec.output) ? (
                <Box
                  component={"img"}
                  alt={"book cover"}
                  src={exec.output}
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
                    __html: getMarkdownFromString(exec.output),
                  }}
                />
              )}
            </Stack>
          );
      })}
    </Stack>
  );
};