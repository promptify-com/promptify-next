import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useStore";
import Code from "./Code";
import Choices from "./Choices";
import File from "./File";
import Textual from "./Textual";
import Credentials from "./Credentials";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";

interface Props {
  input: IPromptInput;
  value: PromptInputType;
  onChange: (value: PromptInputType) => void;
  disabled?: boolean;
}

function RenderInputType({ input, value: initialValue, onChange, disabled }: Props) {
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const isSimulationStreaming = useAppSelector(state => state.chat?.isSimulationStreaming ?? false);

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
          disabled={disabled}
        />
      );
    case "choices":
      return (
        <Choices
          input={input}
          value={initialValue}
          onChange={handleOnChange}
          isGenerating={isGenerating}
          disabled={disabled}
        />
      );
    case "file":
      return (
        <File
          input={input}
          value={initialValue as File}
          onChange={handleOnChange}
          disabled={disabled}
        />
      );
    case "credentials":
      return (
        <Credentials
          input={{
            name: input.name,
            displayName: input.fullName,
            properties: [],
          }}
        />
      );
    default:
      return (
        <Textual
          input={input}
          value={localValue}
          onChange={handleOnChange}
          disabled={disabled}
        />
      );
  }
}

export default RenderInputType;
