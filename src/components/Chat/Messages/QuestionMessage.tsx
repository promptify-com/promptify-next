import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  content: string;
  isRequired: boolean;
  index: number;
}

function QuestionMessage({ content, isRequired, index }: Props) {
  const inputs = useAppSelector(state => state.chat.inputs);

  const totalQuestions = inputs.length;
  return (
    <Stack
      direction={"column"}
      gap={2}
    >
      <Typography
        fontSize={{ xs: 14, md: 16 }}
        fontWeight={400}
        color={"primary.main"}
        lineHeight={"25.4px"}
        letterSpacing={"0.17px"}
      >
        Question {index} of {totalQuestions}
      </Typography>
      <Stack>
        <Typography
          fontSize={{ xs: 20, md: 24 }}
          fontWeight={400}
          lineHeight={"38px"}
          letterSpacing={"0.17px"}
        >
          {content}
        </Typography>
        <Typography
          color={"text.secondary"}
          fontSize={14}
          fontWeight={400}
          lineHeight={"22.4px"}
          letterSpacing={"0.17px"}
        >
          This question is {isRequired ? "Required" : "Optional"}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default QuestionMessage;
