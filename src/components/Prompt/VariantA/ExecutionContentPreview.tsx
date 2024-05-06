import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { IAnswer } from "@/components/Prompt/Types/chat";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import type { Prompts } from "@/core/api/dto/prompts";
import Box from "@mui/material/Box";
import { useMemo } from "react";

interface Props {
  execution: TemplatesExecutions | null;
  prompt: Prompts | undefined;
  answers?: IAnswer[];
  promptOutputMap: { [key: string]: string };
}

function ExecutionContentPreview({ execution, prompt, answers, promptOutputMap }: Props) {
  const replacePlaceholdersWithAnswers = (content: string) => {
    const placeholderRegex = /{{(.*?):.*?}}/g;
    const dollarWordRegex = /\$[a-zA-Z0-9_]+/g;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    const addColoredDollarWords = (text: string) => {
      let lastIndexDollarWords = 0;
      text.replace(dollarWordRegex, (match, index) => {
        parts.push(text.slice(lastIndexDollarWords, index));
        parts.push(
          <Box
            component={"span"}
            key={`dollar-${index}`}
            sx={{ color: "primary.main", whiteSpace: "pre-wrap" }}
          >
            {promptOutputMap[match] ?? match}
          </Box>,
        );
        lastIndexDollarWords = index + match.length;
        return match;
      });
      parts.push(text.slice(lastIndexDollarWords));
    };

    content.replace(placeholderRegex, (match, inputName, index) => {
      addColoredDollarWords(content.slice(lastIndex, index));

      let replacement: string | undefined;

      if (execution && execution.parameters) {
        for (const promptId in execution.parameters) {
          if (execution.parameters.hasOwnProperty(promptId)) {
            const params = execution.parameters[promptId];
            if (params[inputName]) {
              replacement = params[inputName] as string;
              break;
            }
          }
        }
      } else {
        const answer = answers?.find(a => a.inputName === inputName);
        if (answer && typeof answer.answer === "string") {
          replacement = answer.answer;
        }
      }

      if (replacement) {
        parts.push(
          <Box
            component={"span"}
            key={`placeholder-${index}`}
            sx={highlightStyle}
          >
            {typeof replacement === "object" ? JSON.stringify(replacement) : replacement}
          </Box>,
        );
      } else {
        parts.push(
          <Box
            component={"span"}
            key={`placeholder-${index}`}
            sx={highlightStyle}
          >
            {match}
          </Box>,
        );
      }

      lastIndex = index + match.length;
      return match;
    });

    addColoredDollarWords(content.slice(lastIndex));

    return parts;
  };

  const updatedContent = useMemo(
    () => replacePlaceholdersWithAnswers(prompt?.content ?? ""),
    [prompt?.content, promptOutputMap],
  );

  return (
    <Stack
      gap={1}
      sx={{
        p: "16px 24px",
        borderRadius: "16px",
        bgcolor: "surfaceContainerLow",
      }}
    >
      <Typography
        fontSize={14}
        fontWeight={500}
        color={"onPrimaryContainer"}
      >
        {prompt?.title}, {prompt?.engine.name}
      </Typography>
      <Typography
        fontSize={14}
        fontWeight={400}
        fontFamily={"Roboto, Mono"}
        color={"onPrimaryContainer"}
        whiteSpace={"pre-wrap"}
      >
        {updatedContent}
      </Typography>
    </Stack>
  );
}

export default ExecutionContentPreview;

const highlightStyle = {
  color: "primary.main",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
};
