import React, { useEffect, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
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

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      block: "start",
    });
  }, [execution]);

  templateData.prompts.forEach((prompt) => {
    promptsOrderMap[prompt.id] = prompt.order;
    promptsExecutionOrderMap[prompt.id] = prompt.execution_priority;
  });

  const sortedExecutions = [...execution.prompt_executions].sort((a, b) => {
    if (promptsOrderMap[a.prompt] === promptsOrderMap[b.prompt]) {
      console.log(
        promptsExecutionOrderMap[a.prompt],
        promptsExecutionOrderMap[b.prompt]
      );
      return (
        promptsExecutionOrderMap[a.prompt] - promptsExecutionOrderMap[b.prompt]
      );
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
    <Stack
      gap={1}
      sx={{
        width: { md: "70%" },
        mx: "auto",
      }}
    >
      <div ref={ref}></div>
      <Typography
        sx={{ fontSize: 48, fontWeight: 400, color: "onSurface", py: "24px" }}
      >
        {execution.title}
      </Typography>
      {sortedExecutions?.map((exec, index) => {
        const prevItem = index > 0 && sortedExecutions[index - 1];
        const isPrevItemIsImage = prevItem && isImageOutput(prevItem?.output);
        const nextItem = index < sortedExecutions.length - 1 && sortedExecutions[index + 1];
        const isNextItemIsText = nextItem && !isImageOutput(nextItem?.output);
        const prompt = templateData.prompts.find(
          (prompt) => prompt.id === exec.prompt
        );

        if (prompt?.show_output)
          return (
            <Stack key={exec.id} gap={1} sx={{ py: "24px" }}>
              <Subtitle
                sx={{ fontSize: 24, fontWeight: 400, color: "onSurface" }}
              >
                {prompt.title}
              </Subtitle>
              {/* is Text Output */}
              {!isImageOutput(exec.output) && (
                <Box>
                  {isPrevItemIsImage && (
                    <Box
                      component={"img"}
                      alt={"book cover"}
                      src={prevItem.output}
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        (e.target as HTMLImageElement).src =
                          "http://placehold.it/165x215";
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
                    }}
                    dangerouslySetInnerHTML={{
                      __html: getMarkdownFromString(exec.output),
                    }}
                  />
                </Box>
              )}
              {/* is Image Output and Next item is not text */}
              {isImageOutput(exec.output) && !isNextItemIsText && (
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
      })}
    </Stack>
  );
};
