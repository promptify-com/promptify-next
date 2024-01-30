import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useStore";
import Code from "@/components/common/forms/Inputs/Code";
import Choices from "@/components/common/forms/Inputs/Choices";
import File from "@/components/common/forms/Inputs/File";
import Textual from "@/components/common/forms/Inputs/Textual";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";

interface Props {
  input: IPromptInput;
  value: PromptInputType;
  onChange: (value: PromptInputType) => void;
}

function RenderInputType({ input, value: initialValue, onChange }: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isSimulationStreaming = useAppSelector(state => state.chat.isSimulationStreaming);

  const [localValue, setLocalValue] = useState(initialValue);

  const { type: inputType } = input;

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleOnChange = (value: PromptInputType) => {
    if (isSimulationStreaming) return;
    onChange(value);
    setLocalValue(value);
  };

  switch (inputType) {
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
        />
      );
  }
}

export default RenderInputType;
