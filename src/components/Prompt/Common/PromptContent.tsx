import { DetailedHTMLProps, HTMLAttributes } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { TemplatesExecutions } from "@/core/api/dto/templates";
import { theme } from "@/theme";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  execution: TemplatesExecutions | null;
  content: string;
  engineName: string;
  id: number;
}

function PromptContent({ execution, content, engineName, id }: Props) {
  const answers = useAppSelector(state => state.chat.answers);
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
            {typeof replacement === "object" ? JSON.stringify(replacement) : replacement}
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

  const updatedContent = replacePlaceholdersWithAnswers(content);

  return (
    <Stack direction={"column"}>
      <Typography>
        Prompt #{id}, {engineName}
      </Typography>
      <Typography
        mt={2}
        fontFamily={"var(--font-mono)"}
        color={"text.secondary"}
      >
        {updatedContent}
      </Typography>
    </Stack>
  );
}

const HighlightStyle = {
  color: theme.palette.primary.main,
  fontWeight: "600",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
} as DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export default PromptContent;
