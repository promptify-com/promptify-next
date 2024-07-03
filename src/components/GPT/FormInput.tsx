import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HelpOutline from "@mui/icons-material/HelpOutline";
import RenderInputType from "@/components/Prompt/Common/Chat/Inputs";
import CustomTooltip from "@/components/Prompt/Common/CustomTooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers, initialState as initialChatState } from "@/core/store/chatSlice";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import type { PromptInputType } from "@/components/Prompt/Types";
import type { IAnswer } from "@/components/Prompt/Types/chat";
import type { IPromptInput } from "@/common/types/prompt";

interface Props {
  input: IPromptInput;
  answer?: IAnswer;
  disabled?: boolean;
}

function FormInput({ input, answer, disabled }: Props) {
  const { answers, isSimulationStreaming } = useAppSelector(state => state.chat ?? initialChatState);
  const dispatch = useAppDispatch();

  const { fullName, required, type, name: inputName, question, prompt } = input;
  const value = answer?.answer ?? answers.find(answer => answer.inputName === inputName)?.answer ?? "";
  const isTextualType = ["text", "number", "integer"].includes(type);

  const dispatchUpdateAnswers = useDebouncedDispatch((value: string) => {
    updateAnswers(value);
  }, 400);

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
          disabled={disabled}
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
