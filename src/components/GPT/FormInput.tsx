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
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { IPromptInput } from "@/common/types/prompt";
import { setAnswers, initialState as initialChatState } from "@/core/store/chatSlice";
import { LocalStorage } from "@/common/storage";
import { PromptInputType } from "@/components/Prompt/Types";
import { IAnswer } from "@/components/Prompt/Types/chat";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import RadioGroup from "@mui/material/RadioGroup";

interface Props {
  input: IPromptInput;
}

function FormInput({ input }: Props) {
  const { answers, isSimulationStreaming } = useAppSelector(state => state.chat ?? initialChatState);
  const dispatch = useAppDispatch();

  const { fullName, required, type, name: inputName, question, prompt } = input;
  const value = answers.find(answer => answer.inputName === inputName)?.answer ?? "";
  const isTextualType = ["text", "number", "integer"].includes(type);

  const dispatchUpdateAnswers = useDebouncedDispatch((value: string) => {
    updateAnswers(value);
  }, 400);

  useEffect(() => {
    const answersStored = LocalStorage.get("answers") as unknown as IAnswer[];

    if (!answersStored) return;

    const isRelevantAnswer = answersStored.some((answer: IAnswer) => answer.prompt === answer.prompt);

    if (isRelevantAnswer) {
      dispatch(setAnswers(answersStored));
      LocalStorage.remove("answers");
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
      bgcolor={"white"}
      gap={1}
      sx={{
        p: "12px 16px 12px 12px",
        borderRadius: "8px",
        "&:hover": {
          bgcolor: "surface.1",
        },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
      >
        <Radio
          checked={!!value}
          sx={{
            p: 0,
          }}
        />
        <InputLabel
          sx={{
            fontSize: { xs: 12, md: 12 },
            fontWeight: 500,
            color: "#000",
            lineHeight: "100%",
            textTransform: "capitalize",
          }}
        >
          {fullName?.replace(/_/g, " ")} {required && <span>*</span>} :
        </InputLabel>
      </Stack>

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
        {required && (
          <Typography
            fontSize={12}
            lineHeight={"100%"}
            fontWeight={400}
            letterSpacing={"0.06px"}
            sx={{ opacity: 0.5 }}
          >
            Required
          </Typography>
        )}
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
