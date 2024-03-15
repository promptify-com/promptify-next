import { useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HelpOutline from "@mui/icons-material/HelpOutline";
import RenderInputType from "@/components/Prompt/Common/Chat/Inputs";
import CustomTooltip from "@/components/Prompt/Common/CustomTooltip";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { IPromptInput } from "@/common/types/prompt";
import { setAnswers } from "@/core/store/chatSlice";
import Storage from "@/common/storage";
import { PromptInputType } from "@/components/Prompt/Types";
import { IAnswer } from "@/components/Prompt/Types/chat";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";

interface Props {
  input: IPromptInput;
}

function FormInput({ input }: Props) {
  const { answers, isSimulationStreaming } = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();

  const { fullName, required, type, name: inputName, question, prompt } = input;
  const value = answers.find(answer => answer.inputName === inputName)?.answer ?? "";
  const isTextualType = ["text", "number", "integer"].includes(type);

  const dispatchUpdateAnswers = useDebouncedDispatch((value: string) => {
    updateAnswers(value);
  }, 400);

  useEffect(() => {
    const answersStored = Storage.get("answers");

    if (!answersStored) return;

    const isRelevantAnswer = answersStored.some((answer: IAnswer) => answer.prompt === answer.prompt);

    if (isRelevantAnswer) {
      dispatch(setAnswers(answersStored));
      Storage.remove("answers");
    }
  }, []);

  const onChange = (value: PromptInputType) => {
    if (isSimulationStreaming) return;
    if (isTextualType) {
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
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
      px={{ xs: "16px", md: "24px" }}
      sx={{
        "&:hover": {
          bgcolor: "surface.1",
        },
      }}
    >
      <Box>
        <InputLabel
          sx={{
            fontSize: { xs: 14, md: 15 },
            fontWeight: 500,
            color: "primary.main",
          }}
        >
          {fullName} {required && <span>*</span>} :
        </InputLabel>
      </Box>

      <Stack
        display={"flex"}
        alignItems={"start"}
        position={"relative"}
        flex={1}
        width={"100%"}
      >
        <RenderInputType
          input={input}
          value={value}
          onChange={onChange}
        />
      </Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"8px"}
      >
        <CustomTooltip
          title={
            <Typography
              color={"white"}
              textTransform={"capitalize"}
              fontSize={11}
            >
              {type}
            </Typography>
          }
        >
          <IconButton
            sx={{
              opacity: 0.3,
              border: "none",
            }}
          >
            <HelpOutline />
          </IconButton>
        </CustomTooltip>
      </Stack>
    </Stack>
  );
}

export default FormInput;
