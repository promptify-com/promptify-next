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

  const regex = /\{\{(\w+):[^}]*\}\}/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let highlightedContent: JSX.Element[] = [];
  let key = 0;

  while ((match = regex.exec(content)) !== null) {
    if (lastIndex < match.index) {
      highlightedContent.push(<span key={key++}>{content.substring(lastIndex, match.index)}</span>);
    }

    const inputName = match[1]; // The word between {{ and :
    const isSelectedForInput =
      selectedPrompt && selectedPrompt.promptId === promptId && selectedPrompt.match === inputName;
    const existingAnswer = (answers.find(answer => inputName === answer.inputName)?.answer as string) || inputName;

    highlightedContent.push(
      <Button
        key={key++}
        onClick={() => handleHighlightClick(promptId, inputName)}
        sx={{
          display: "inline-block",
          p: "0px 8px",
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
              dispatchUpdateAnswers(event.target.value);
              setSelectedPrompt(null);
            }}
            sx={{
              color: "primary.main",
            }}
          />
        ) : (
          <Typography color={"primary.main"}>{existingAnswer}</Typography>
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
