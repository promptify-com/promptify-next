import Button from "@mui/material/Button";
import { initialState as initialChatState, setAnswers, setChoiceSelected } from "@/core/store/chatSlice";
import { IAnswer, IMessage } from "../Prompt/Types/chat";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Stack from "@mui/material/Stack";

interface Props {
  message: IMessage;
}

const ChoicesButton = ({ message }: Props) => {
  const dispatch = useAppDispatch();
  const { inputs, answers } = useAppSelector(state => state.chat ?? initialChatState);

  const answer = answers.find(answer => answer.inputName === message.questionInputName);
  const { questionInputName, text, choices } = message;

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

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={2}
    >
      {choices?.map((choice: string) => (
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
  );
};

export default ChoicesButton;
