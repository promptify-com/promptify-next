import { useState } from "react";
import Button from "@mui/material/Button";
import CodeFieldModal from "../modals/CodeFieldModal";
import { IAnswer, IMessage } from "../Prompt/Types/chat";

import { initialState as initialChatState, setAnswers } from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { PromptInputType } from "../Prompt/Types";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import Stack from "@mui/material/Stack";

interface Props {
  message: IMessage;
}

const CodeButton = ({ message }: Props) => {
  const dispatch = useAppDispatch();
  const [codeFieldOpen, setCodeFieldOpen] = useState(false);
  const { inputs, answers } = useAppSelector(state => state.chat ?? initialChatState);
  const isSimulationStreaming = useAppSelector(state => state.chat?.isSimulationStreaming ?? false);
  const answer = answers.find(answer => answer.inputName === message.questionInputName);
  const input = inputs.find(input => input.name === message.questionInputName);
  const value = answers.find(answer => answer.inputName === input?.name)?.answer ?? "";
  const { questionInputName, text } = message;

  const isTextualType = ["text", "number", "integer"].includes(input?.type as string);

  const dispatchUpdateAnswers = useDebouncedDispatch((value: string) => {
    updateAnswers(value);
  }, 400);

  const handleOnChange = (value: PromptInputType) => {
    if (isSimulationStreaming) return;

    if (isTextualType) {
      dispatchUpdateAnswers(value as string);
    } else {
      updateAnswers(value);
    }
  };

  const updateAnswers = (value: PromptInputType) => {
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
    >
      <Button
        onClick={() => {
          setCodeFieldOpen(true);
        }}
        variant="outlined"
        disabled={!!answer}
        sx={{
          "&:hover": {
            border: "1px solid",
            borderColor: "primary.main",
            color: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        insert your code
      </Button>
      {codeFieldOpen && (
        <CodeFieldModal
          open
          setOpen={setCodeFieldOpen}
          value={value as string}
          onSubmit={val => handleOnChange(val)}
        />
      )}
    </Stack>
  );
};

export default CodeButton;
