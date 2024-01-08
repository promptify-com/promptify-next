import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useApiAccess from "@/components/Prompt/Hooks/useApiAccess";
import { setAnswers } from "@/core/store/chatSlice";
import Code from "@/components/common/forms/Inputs/Code";
import Choices from "@/components/common/forms/Inputs/Choices";
import File from "@/components/common/forms/Inputs/File";
import Textual from "@/components/common/forms/Inputs/Textual";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";
import type { IAnswer } from "@/components/Prompt/Types/chat";

interface Props {
  input: IPromptInput;
  value: PromptInputType;
  disabled: boolean;
  onChange: (value: PromptInputType) => void;
}

function RenderInputType({ input, value: initialValue, disabled, onChange }: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [localValue, setLocalValue] = useState(initialValue);

  const { type } = input;

  const isTextualType = type === "text" || type === "number" || type === "integer";

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    if (disabled) return;

    onChange(localValue);
  };

  const handleOnChange = (value: PromptInputType) => {
    if (disabled) return;
    if (isTextualType) {
      setLocalValue(value);
    } else {
      onChange(value);
    }
  };

  switch (type) {
    case "code":
      return (
        <Code
          input={input}
          onChange={handleOnChange}
          value={initialValue}
          isGenerating={isGenerating}
        />
      );
    case "choices":
      return (
        <Choices
          input={input}
          value={initialValue}
          onChange={handleOnChange}
          isGenerating={isGenerating}
        />
      );
    case "file":
      return (
        <File
          input={input}
          value={initialValue as File}
          onChange={handleOnChange}
        />
      );
    default:
      return (
        <Textual
          input={input}
          value={localValue}
          onChange={handleOnChange}
          onBlur={onBlur}
        />
      );
  }
}

export default RenderInputType;
