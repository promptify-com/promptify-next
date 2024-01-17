import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useApiAccess from "@/components/Prompt/Hooks/useApiAccess";
import { setAnswers } from "@/core/store/chatSlice";
import Code from "@/components/Prompt/Common/Chat/Inputs/Code";
import Choices from "@/components/Prompt/Common/Chat/Inputs/Choices";
import File from "@/components/Prompt/Common/Chat/Inputs/File";
import Textual from "@/components/Prompt/Common/Chat/Inputs/Textual";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";
import type { IAnswer } from "@/components/Prompt/Types/chat";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";

interface Props {
  input: IPromptInput;
  value: PromptInputType;
}

function RenderInputType({ input, value: initialValue }: Props) {
  const dispatch = useAppDispatch();
  const { dispatchNewExecutionData } = useApiAccess();

  const { answers, isSimulationStreaming } = useAppSelector(state => state.chat);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [localValue, setLocalValue] = useState(initialValue);

  const { name: inputName, required, type, prompt, question } = input;

  const isTextualType = type === "text" || type === "number" || type === "integer";

  const dispatchUpdateAnswers = useDebouncedDispatch((value: string) => {
    updateAnswers(value);
  }, 400);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const onChange = (value: string | File) => {
    if (isSimulationStreaming) return;
    if (isTextualType) {
      setLocalValue(value);
      dispatchUpdateAnswers(value as string);
    } else {
      updateAnswers(value);
    }
  };

  const updateAnswers = (value: PromptInputType) => {
    const _answers = [...answers.filter(answer => answer.inputName !== inputName)];

    const isEmptyTextualInput = isTextualType && typeof value === "string" && value.trim() === "";

    if (!isEmptyTextualInput) {
      const newAnswer: IAnswer = {
        question: question!,
        required,
        inputName,
        prompt: prompt!,
        answer: value,
      };
      _answers.push(newAnswer);
    }

    dispatch(setAnswers(_answers));
    dispatchNewExecutionData();
  };

  switch (type) {
    case "code":
      return (
        <Code
          input={input}
          onChange={onChange}
          value={initialValue}
          isGenerating={isGenerating}
        />
      );
    case "choices":
      return (
        <Choices
          input={input}
          value={initialValue}
          onChange={onChange}
          isGenerating={isGenerating}
        />
      );
    case "file":
      return (
        <File
          input={input}
          value={initialValue as File}
          onChange={onChange}
        />
      );
    default:
      return (
        <Textual
          input={input}
          value={localValue}
          onChange={onChange}
        />
      );
  }
}

export default RenderInputType;
