import { useState } from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import { setAnswers } from "@/core/store/chatSlice";
import type { IAnswer } from "../Prompt/Types/chat";

interface Props {
  content: string;
  promptId: number;
}

const HighlightContent = ({ content, promptId }: Props) => {
  const dispatch = useAppDispatch();
  const { inputs, answers } = useAppSelector(state => state.chat);
  const [selectedPrompt, setSelectedPrompt] = useState<{ promptId: number; match: string } | null>(null);

  function handleHighlightClick(promptId: number, match: string) {
    setSelectedPrompt({ promptId, match });
  }
  const dispatchUpdateAnswers = useDebouncedDispatch((value: string) => {
    updateAnswers(value);
  }, 400);

  const updateAnswers = (value: string) => {
    if (!selectedPrompt) {
      return;
    }

    const matchedInput = inputs.find(input => selectedPrompt.match === input.name);

    if (!matchedInput) {
      return;
    }

    const { required, question, name: inputName, prompt } = matchedInput;

    const newAnswers = answers.filter(answer => answer.inputName !== inputName);

    const newAnswer: IAnswer = {
      question: question!,
      required,
      inputName,
      prompt: prompt!,
      answer: value,
    };
    newAnswers.push(newAnswer);

    dispatch(setAnswers(newAnswers));
  };

  const highlightContent = () => {
    const regex = /\{\{(\w+):[^}]*\}\}/g;
    let match;
    let lastIndex = 0;
    let highlightedContent = [];
    let key = 0;

    while ((match = regex.exec(content)) !== null) {
      if (lastIndex < match.index) {
        highlightedContent.push(<span key={key++}>{content.substring(lastIndex, match.index)}</span>);
      }

      const inputName = match[1];
      const input = inputs.find(input => input.name === inputName);
      const isSelectedForInput = selectedPrompt && selectedPrompt.match === inputName;
      const answer = answers.find(answer => inputName === answer.inputName)?.answer as string;
      const existingAnswer = answer || inputName;

      highlightedContent.push(
        <Box
          key={key++}
          onClick={() => handleHighlightClick(promptId, inputName)}
          sx={{
            display: "inline-block",
            p: "0px 8px",
            borderRadius: "24px",
            bgcolor: "secondaryContainer",
            color: "primary.main",
            "&:hover": {
              bgcolor: "secondaryContainer",
            },
          }}
        >
          {isSelectedForInput ? (
            <InputBase
              autoFocus
              defaultValue={existingAnswer}
              onBlur={event => {
                const newValue = event.target.value;
                if (newValue !== existingAnswer) {
                  dispatchUpdateAnswers(newValue);
                }
                setSelectedPrompt(null);
              }}
              type={input?.type}
              sx={{ color: "primary.main" }}
            />
          ) : (
            <Typography color="primary.main">
              {existingAnswer + `${input?.required && inputName === existingAnswer ? "*" : ""}`}
            </Typography>
          )}
        </Box>,
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      highlightedContent.push(<span key={key++}>{content.substring(lastIndex)}</span>);
    }

    return highlightedContent;
  };

  return <>{highlightContent()}</>;
};

export default HighlightContent;
