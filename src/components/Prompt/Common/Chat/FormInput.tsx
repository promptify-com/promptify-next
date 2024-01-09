import { useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HelpOutline from "@mui/icons-material/HelpOutline";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import RenderInputType from "@/components/common/forms/Inputs";
import CustomTooltip from "../../../common/CustomTooltip";
import useVariant from "../../Hooks/useVariant";
import type { IPromptInput } from "@/common/types/prompt";
import useApiAccess from "../../Hooks/useApiAccess";
import { setAnswers } from "@/core/store/chatSlice";
import { PromptInputType } from "@/components/Prompt/Types";
import { IAnswer } from "@/components/Prompt/Types/chat";

interface Props {
  input: IPromptInput;
}

function FormInput({ input }: Props) {
  const { isVariantB } = useVariant();

  const { answers, isSimulationStreaming } = useAppSelector(state => state.chat);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const [labelWidth, setLabelWidth] = useState(0);
  const dispatch = useAppDispatch();
  const { dispatchNewExecutionData } = useApiAccess();

  const { fullName, required, type, name: inputName, question, prompt } = input;
  const value = answers.find(answer => answer.inputName === inputName)?.answer ?? "";
  const isTextualType = type === "text" || type === "number" || type === "integer";

  useEffect(() => {
    if (isVariantB) return;
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, [fullName, isVariantB]);

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

  return (
    <Stack
      direction={"row"}
      p={isVariantB ? "6px" : 0}
      alignItems={"center"}
      gap={1}
      borderBottom={isVariantB ? "1px solid #ECECF4" : "none"}
    >
      {isVariantB && (
        <Radio
          size="small"
          checked={!!value}
          value="a"
          name="radio-buttons"
        />
      )}
      <Box ref={labelRef}>
        <InputLabel
          sx={{
            fontSize: { xs: 12, md: 15 },
            fontWeight: 500,
            color: "primary.main",
          }}
        >
          {fullName} {required && isVariantB && <span>*</span>} :
        </InputLabel>
      </Box>

      <Stack
        display={"flex"}
        alignItems={"start"}
        position={"relative"}
        flex={1}
        width={"100%"}
        maxWidth={`calc(100% - ${labelWidth}px)`}
      >
        <RenderInputType
          input={input}
          value={value}
          disabled={isSimulationStreaming}
          onChange={updateAnswers}
        />
      </Stack>
      {isVariantB && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={"8px"}
        >
          {required && (
            <Typography
              sx={{
                fontSize: { xs: 12, md: 15 },
                fontWeight: 400,
                lineHeight: "100%",
                opacity: 0.3,
              }}
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
      )}
    </Stack>
  );
}

export default FormInput;
