import { DetailedHTMLProps, HTMLAttributes } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { TemplatesExecutions } from "@/core/api/dto/templates";
import type { IAnswer } from "@/common/types/chat";
import type { Prompts } from "@/core/api/dto/prompts";

interface Props {
  execution: TemplatesExecutions | null;
  prompt: Prompts;
  answers?: IAnswer[];
  id: number;
}

function PromptContent({ execution, prompt, id, answers }: Props) {
  function replacePlaceholdersWithAnswers(content: string): React.ReactNode {
    const placeholderRegex = /{{(.*?):.*?}}/g;
    const dollarWordRegex = /\$[a-zA-Z0-9_]+/g;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    const addColoredDollarWords = (text: string) => {
      let lastIndexDollarWords = 0;
      text.replace(dollarWordRegex, (match, index) => {
        parts.push(text.slice(lastIndexDollarWords, index));
        parts.push(
          <span
            key={`dollar-${index}`}
            style={HighlightStyle}
          >
            {match}
          </span>,
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
          <span
            key={`placeholder-${index}`}
            style={HighlightStyle}
          >
            {replacement}
          </span>,
        );
      } else {
        parts.push(
          <span
            key={`placeholder-${index}`}
            style={HighlightStyle}
          >
            {match}
          </span>,
        );
      }

      lastIndex = index + match.length;
      return match;
    });

    addColoredDollarWords(content.slice(lastIndex));

    return parts;
  }

  const updatedContent = replacePlaceholdersWithAnswers(prompt.content);

  return (
    <Stack direction={"column"}>
      <Typography>
        Prompt #{id}, {prompt.engine.name}
      </Typography>
      <Typography
        mt={2}
        fontFamily={"Space Mono"}
        color={"text.secondary"}
      >
        {updatedContent}
      </Typography>
    </Stack>
  );
}

const HighlightStyle = {
  color: "primary.main",
  fontWeight: "600",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
} as DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export default PromptContent;
