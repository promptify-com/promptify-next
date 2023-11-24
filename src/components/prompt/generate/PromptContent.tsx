import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { IAnswer } from "@/common/types/chat";
import type { Prompts } from "@/core/api/dto/prompts";

interface Props {
  prompt: Prompts;
  answers: IAnswer[];
  id: number;
}

function PromptContent({ prompt, id, answers }: Props) {
  function replacePlaceholdersWithAnswers(content: string, answers: IAnswer[]): React.ReactNode {
    const regex = /{{(.*?):.*?}}/g;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    content.replace(regex, (match, inputName, index) => {
      parts.push(content.slice(lastIndex, index));

      const answer = answers.find(a => a.inputName === inputName);

      if (answer && typeof answer.answer === "string") {
        parts.push(
          <span
            key={index}
            style={{ color: "#375CA9", fontWeight: "600" }}
          >
            {answer.answer}
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
