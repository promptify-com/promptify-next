import { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Edit from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useApiAccess from "@/components/Prompt/Hooks/useApiAccess";
import { setAnswers } from "@/core/store/chatSlice";
import Code from "@/components/Prompt/Common/Chat/Inputs/Code";
import Choices from "@/components/Prompt/Common/Chat/Inputs/Choices";
import File from "@/components/Prompt/Common/Chat/Inputs/File";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";
import type { IAnswer } from "@/components/Prompt/Types/chat";

interface Props {
  input: IPromptInput;
  value: PromptInputType;
}

function RenderInputType({ input, value: initialValue }: Props) {
  const dispatch = useAppDispatch();
  const { dispatchNewExecutionData } = useApiAccess();
  const { isVariantB } = useVariant();

  const { answers, isSimulationStreaming } = useAppSelector(state => state.chat);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [localValue, setLocalValue] = useState(initialValue);
  const [inputWidth, setInputWidth] = useState<string>();
  const fieldRef = useRef<HTMLInputElement | null>(null);

  const { name: inputName, required, type, prompt, question } = input;

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const calculateDynamicWidth = (value: string) => {
    const tempEl = document.createElement("span");

    tempEl.style.fontSize = "14px";
    tempEl.style.fontFamily = "Arial";
    tempEl.style.visibility = "hidden";
    tempEl.style.position = "absolute";
    tempEl.style.whiteSpace = "nowrap";
    document.body.appendChild(tempEl);

    const placeholder = required ? "Required" : "Optional";
    tempEl.textContent = value.toString() || placeholder;

    const width = tempEl.offsetWidth;

    document.body.removeChild(tempEl);

    const ExtraPadding = 10;

    return `${width + ExtraPadding}px`;
  };

  const isFile = initialValue instanceof File;
  const isTextualType = type === "text" || type === "number" || type === "integer";

  const onBlur = () => {
    if (isSimulationStreaming) return;

    updateAnswers(localValue);
  };

  const onChange = (value: string | File) => {
    if (isSimulationStreaming) return;
    if (isTextualType) {
      setLocalValue(value);
      if (isVariantB) return;
      setInputWidth(calculateDynamicWidth(value.toString()));
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
          isFile={isFile}
          onChange={onChange}
        />
      );
    default:
      return (
        <Stack
          direction={"row"}
          gap={1}
          position={"relative"}
          alignItems={"center"}
          width={"100%"}
        >
          <TextField
            inputRef={ref => (fieldRef.current = ref)}
            fullWidth={isVariantB}
            disabled={isGenerating}
            sx={{
              ".MuiInputBase-input": {
                ...(isVariantB ? {} : { width: inputWidth ? inputWidth : "70px" }),

                p: 0,
                color: "onSurface",
                fontSize: { xs: 12, md: 14 },
                fontWeight: 400,
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 0.65,
                },
                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "&[type=number]": {
                  MozAppearance: "textfield",
                },
              },
              ".MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
              ".MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
            }}
            placeholder={isVariantB ? "Type here" : required ? "Required" : "Optional"}
            type={type}
            value={localValue}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
          />
          {!isVariantB && (
            <Edit
              onClick={() => fieldRef.current?.focus()}
              sx={{
                fontSize: 16,
                color: "primary.main",
                p: "4px",
                cursor: "pointer",
                opacity: initialValue ? 0.9 : 0.45,
                ":hover": {
                  opacity: 1,
                },
              }}
            />
          )}
        </Stack>
      );
  }
}

export default RenderInputType;
