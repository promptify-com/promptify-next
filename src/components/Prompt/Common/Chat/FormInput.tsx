import { useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HelpOutline from "@mui/icons-material/HelpOutline";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import RenderInputType from "./Inputs";
import CustomTooltip from "../CustomTooltip";
import useVariant from "../../Hooks/useVariant";
import type { IPromptInput } from "@/common/types/prompt";
import { setAnswers } from "@/core/store/chatSlice";
import Storage from "@/common/storage";
import { IAnswer } from "../../Types/chat";

interface Props {
  input: IPromptInput;
}

function FormInput({ input }: Props) {
  const { isVariantB } = useVariant();

  const dispatch = useAppDispatch();
  const answers = useAppSelector(state => state.chat.answers);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const [labelWidth, setLabelWidth] = useState(0);

  const { fullName, required, type, name } = input;

  useEffect(() => {
    const answersStored = Storage.get("answers");

    if (!answersStored) return;

    const isRelevantAnswer = answersStored.some((answer: IAnswer) => answer.prompt === answer.prompt);

    if (isRelevantAnswer) {
      dispatch(setAnswers(answersStored));
      Storage.remove("answers");
    }
  }, []);

  const value = answers.find(answer => answer.inputName === name)?.answer ?? "";

  useEffect(() => {
    if (isVariantB) return;
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, [fullName, isVariantB]);

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
