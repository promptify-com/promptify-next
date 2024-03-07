import React, { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, InputBase } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers } from "@/core/store/chatSlice";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import type { Templates } from "@/core/api/dto/templates";
import type { IAnswer } from "../Prompt/Types/chat";

interface Props {
  template: Templates;
}

function highlightContent(content: string, promptId: number): JSX.Element[] {
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
    const matchedInput = inputs.find(input => selectedPrompt?.match.includes(input.name));
    console.log(matchedInput);

    if (!matchedInput || !selectedPrompt) {
      return;
    }

    const { required, question, name: inputName, prompt } = matchedInput;

    const _answers = answers.filter(answer => !selectedPrompt?.match.includes(answer.inputName));

    const newAnswer: IAnswer = {
      question: question!,
      required,
      inputName,
      prompt: prompt!,
      answer: value,
    };
    _answers.push(newAnswer);

    dispatch(setAnswers(_answers));
  };

  const getDisplayValue = (matchText: string) => {
    // Check if there's an existing answer for this input
    const existingAnswer = answers.find(answer => matchText.includes(answer.inputName));
    return existingAnswer ? (existingAnswer.answer as string) : matchText;
  };

  const regex = /(\{\{(.*?)\}\})/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let highlightedContent: JSX.Element[] = [];
  let key = 0;

  while ((match = regex.exec(content)) !== null) {
    if (lastIndex < match.index) {
      highlightedContent.push(<span key={key++}>{content.substring(lastIndex, match.index)}</span>);
    }

    const matchText = match[0];
    const displayValue = getDisplayValue(matchText);

    const isSelectedForInput =
      selectedPrompt && selectedPrompt.promptId === promptId && selectedPrompt.match === matchText;

    highlightedContent.push(
      <Button
        variant="text"
        key={key++}
        sx={{
          display: "inline-block",
          p: "0px 8px",
          bgcolor: "secondaryContainer",
          color: "primary.main",
          "&:hover": {
            bgcolor: "secondaryContainer",
          },
        }}
        onClick={() => handleHighlightClick(promptId, matchText)}
      >
        {isSelectedForInput ? (
          <InputBase
            autoFocus
            defaultValue={displayValue}
            size="small"
            onBlur={event => {
              dispatchUpdateAnswers(event.target.value);
              setSelectedPrompt(null);
            }}
            onChange={event => {
              dispatchUpdateAnswers(event.target.value);
            }}
          />
        ) : (
          <Typography color={"primary.main"}>{displayValue}</Typography>
        )}
      </Button>,
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    highlightedContent.push(<span key={key++}>{content.substring(lastIndex)}</span>);
  }

  return highlightedContent;
}

function FormPromptContent({ template }: Props) {
  return (
    <Stack p={"16px 24px"}>
      {template.prompts.map(prompt => (
        <Fragment key={prompt.id}>
          <Stack
            direction={"row"}
            gap={1}
          >
            <Typography
              fontSize={16}
              lineHeight={"22px"}
            >
              {prompt.title}
            </Typography>
            <Typography color={"text.secondary"}>{prompt.engine.name}</Typography>
          </Stack>
          <Box
            sx={{
              pb: "42px",
              pt: "20px",
              position: "relative",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "35px",
              letterSpacing: "0.17px",
            }}
          >
            {highlightContent(prompt.content, prompt.id)}
          </Box>
        </Fragment>
      ))}
    </Stack>
  );
}

export default FormPromptContent;
