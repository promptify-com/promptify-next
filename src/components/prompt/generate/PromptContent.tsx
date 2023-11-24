import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { IAnswer } from "@/common/types/chat";
import type { Prompts } from "@/core/api/dto/prompts";
import { TemplatesExecutions } from "@/core/api/dto/templates";

interface Props {
  execution: TemplatesExecutions | null;
  prompt: Prompts;
  answers: IAnswer[];
  id: number;
}

function PromptContent({ execution, prompt, id, answers }: Props) {
  function replacePlaceholdersWithAnswers(content: string, answers: IAnswer[]): React.ReactNode {
    const regex = /{{(.*?):.*?}}/g;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    content.replace(regex, (match, inputName, index) => {
      parts.push(content.slice(lastIndex, index));

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
        const answer = answers.find(a => a.inputName === inputName);
        if (answer && typeof answer.answer === "string") {
          replacement = answer.answer;
        }
      }

      if (replacement) {
        parts.push(
          <span
            key={index}
            style={{ color: "#375CA9", fontWeight: "600" }}
          >
            {replacement}
          </span>,
        );
      } else {
        parts.push(
          <span
            key={index}
            style={{ color: "#375CA9", fontWeight: "600" }}
          >
            {match}
          </span>,
        );
      }

      lastIndex = index + match.length;
      return match;
    });

    parts.push(content.slice(lastIndex));

    return parts;
  }

  const updatedContent = replacePlaceholdersWithAnswers(prompt.content, answers);

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

export default PromptContent;
