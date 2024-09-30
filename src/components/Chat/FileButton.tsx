import { IAnswer, IMessage } from "../Prompt/Types/chat";

import { initialState as initialChatState, setAnswers, setFileData } from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { PromptInputType } from "../Prompt/Types";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import Stack from "@mui/material/Stack";
import File from "@/components/Prompt/Common/Chat/Inputs/File";
import { useState } from "react";

interface Props {
  message: IMessage;
}

const FileButton = ({ message }: Props) => {
  const dispatch = useAppDispatch();
  const [localValue, setLocalValue] = useState<PromptInputType>("");
  const { inputs, answers } = useAppSelector(state => state.chat ?? initialChatState);
  const isSimulationStreaming = useAppSelector(state => state.chat?.isSimulationStreaming ?? false);
  const answer = answers.find(answer => answer.inputName === message.questionInputName);
  const input = inputs.find(input => input.name === message.questionInputName);
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
      setLocalValue(value as string);
      dispatch(setFileData(value as File));
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
      <File
        input={input!}
        value={localValue as File}
        onChange={handleOnChange}
        disabled={!!answer}
        inputType={input?.type as string}
      />
    </Stack>
  );
};

export default FileButton;
