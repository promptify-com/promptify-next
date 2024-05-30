import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IAnswer, IMessage } from "@/components/Prompt/Types/chat";
import FormParam from "@/components/Prompt/Common/Chat/FormParam";
import { initialState as initialChatState, setAnswers, setChoiceSelected } from "@/core/store/chatSlice";
import Button from "@mui/material/Button";

interface Props {
  message: IMessage;
  variant: "input" | "param";
}

function QuestionMessage({ message, variant }: Props) {
  const dispatch = useAppDispatch();
  const { inputs, params, answers } = useAppSelector(state => state.chat ?? initialChatState);

  const { questionIndex, questionInputName, text, isRequired, choices, type } = message;
  const totalQuestions = inputs.length + params.length;

  let questionCounterText = `Question ${questionIndex} of ${totalQuestions}`;
  let mainQuestionText = text;
  let additionalInfoText = variant === "input" ? `This question is ${isRequired ? "Required" : "Optional"}` : "";

  if (text.includes("##/")) {
    const textParts = text.split("##/");
    questionCounterText = textParts[0];
    mainQuestionText = textParts[1];
    additionalInfoText = textParts.length > 2 ? textParts[2] : "";
  }

  console.log(choices);

  const answer = answers.find(answer => answer.inputName === message.questionInputName);
  console.log(answer);

  const handleChoiceSelection = (value: string) => {
    const input = inputs.find(input => input.name === questionInputName);
    if (!input?.prompt) {
      return;
    }
    const _answers = [...answers.filter(answer => answer.inputName !== questionInputName)];

    const newAnswer: IAnswer = {
      inputName: questionInputName!,
      question: text,
      required: false,
      answer: value,
      prompt: input.prompt,
    };

    _answers.push(newAnswer);
    dispatch(setAnswers(_answers));
  };
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
        {questionCounterText}
      </Typography>

      <Stack gap={2}>
        <Typography
          fontSize={{ xs: 20, md: 24 }}
          fontWeight={400}
          lineHeight={"38px"}
          letterSpacing={"0.17px"}
        >
          {mainQuestionText}
        </Typography>

        <Typography
          color={"text.secondary"}
          fontSize={14}
          fontWeight={400}
          lineHeight={"22.4px"}
          letterSpacing={"0.17px"}
        >
          {additionalInfoText}
        </Typography>

        {param && variant === "param" && (
          <FormParam
            variant="button"
            param={param}
          />
        )}

        {type === "choices" && choices?.length && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
          >
            {choices?.map(choice => (
              <Button
                onClick={() => {
                  handleChoiceSelection(choice);
                  dispatch(setChoiceSelected(choice));
                }}
                variant="outlined"
                disabled={!!answer}
                sx={{
                  color: answer?.answer === choice ? "onPrimary" : "primary.main",
                  bgcolor: answer?.answer === choice ? "primary.main" : "transparent",
                  "&:hover": {
                    border: "1px solid",
                    borderColor: "primary.main",
                    color: "primary.main",
                    bgcolor: "action.hover",
                  },
                  "&:disabled": {
                    color: answer?.answer === choice ? "onPrimary" : "gray",
                  },
                }}
              >
                {choice}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default QuestionMessage;
