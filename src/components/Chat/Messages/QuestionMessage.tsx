import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "@/components/Prompt/Types/chat";
import FormParam from "@/components/Prompt/Common/Chat/FormParam";

interface Props {
  message: IMessage;
  variant: "input" | "param";
}

function QuestionMessage({ message, variant }: Props) {
  const { inputs, params } = useAppSelector(state => state.chat);

  const { questionIndex, questionInputName, text, isRequired } = message;
  const totalQuestions = inputs.length + params.length;

  const param = params.find(param => param.parameter.name === questionInputName);

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
        Question {questionIndex} of {totalQuestions}
      </Typography>

      <Stack gap={2}>
        <Typography
          fontSize={{ xs: 20, md: 24 }}
          fontWeight={400}
          lineHeight={"38px"}
          letterSpacing={"0.17px"}
        >
          {text}
        </Typography>

        <Typography
          color={"text.secondary"}
          fontSize={14}
          fontWeight={400}
          lineHeight={"22.4px"}
          letterSpacing={"0.17px"}
        >
          {variant === "input" ? <>This question is {isRequired ? "Required" : "Optional"}</> : "Choose option:"}
        </Typography>

        {param && variant === "param" && (
          <FormParam
            variant="button"
            param={param}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default QuestionMessage;
