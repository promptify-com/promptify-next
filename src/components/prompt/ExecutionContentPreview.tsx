import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { Prompts } from "@/core/api/dto/prompts";

interface Props {
  prompts: Prompts[];
  execution: TemplatesExecutions;
}

function ExecutionContentPreview({ prompts, execution }: Props) {
  function replacePlaceholdersWithAnswers(prompt: Prompts): React.ReactNode {
    const regex = /{{(.*?):.*?}}/g;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
    const content = prompt.content;

    content.replace(regex, (match, inputName, index) => {
      parts.push(content.slice(lastIndex, index));

      const answer: string =
        execution.parameters && execution.parameters[prompt.id] ? execution.parameters[prompt.id][inputName] : "";

      if (answer) {
        parts.push(
          <span
            key={index}
            style={{ color: "#375CA9", fontWeight: "600", wordBreak: "break-word" }}
          >
            {answer}
          </span>,
        );
      } else {
        parts.push(
          <span
            key={index}
            style={{ color: "#375CA9", fontWeight: "600", wordBreak: "break-word" }}
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

  const promptContents = prompts.map(prompt => ({
    ...prompt,
    content: replacePlaceholdersWithAnswers(prompt),
  }));

  return (
    <Stack
      gap={5}
      p={{ xs: "20px", md: "20px 8px" }}
    >
      {promptContents.map(prompt => (
        <Stack
          key={prompt.id}
          gap={2}
        >
          <Typography>
            Prompt #{prompt.order}, {prompt.engine.name}
          </Typography>
          <Typography
            fontFamily={"Space Mono"}
            color={"text.secondary"}
          >
            {prompt.content}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default ExecutionContentPreview;
