import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "@/components/Prompt/Types/chat";
import FormParam from "@/components/Prompt/Common/Chat/FormParam";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import ChoicesButton from "../ChoicesButton";
import CodeButton from "../CodeButton";

interface Props {
  message: IMessage;
  variant: "input" | "param";
}

function QuestionMessage({ message, variant }: Props) {
  const { inputs, params } = useAppSelector(state => state.chat ?? initialChatState);

  const { questionIndex, questionInputName, text, isRequired, choices, type } = message;
  const totalQuestions = inputs.length + params.length;

  let questionCounterText = `Question ${questionIndex} of ${totalQuestions}`;
  let mainQuestionText = text;
  let additionalInfoText = variant === "input" ? `This question is ${isRequired ? "Required" : "Optional"}` : "";

  if (text.includes("##/")) {
    const textParts = text.split("##/");
    questionCounterText = textParts[0];
    mainQuestionText = textParts[1];
    additionalInfoText = textParts.length > 2 ? textParts[2] : "";
  }

  const param = params.find(param => param.parameter.name === questionInputName);

  return (
    <Stack
      direction={"column"}
      gap={2}
    >
      <Typography
        fontSize={{ xs: 14, md: 16 }}
        fontWeight={400}
        color={"primary.main"}
        lineHeight={"25.4px"}
        letterSpacing={"0.17px"}
      >
        {questionCounterText}
      </Typography>

      <Stack gap={2}>
        <Typography
          fontSize={{ xs: 20, md: 24 }}
          fontWeight={400}
          lineHeight={"38px"}
          letterSpacing={"0.17px"}
        >
          {mainQuestionText}
        </Typography>

        <Typography
          color={"text.secondary"}
          fontSize={14}
          fontWeight={400}
          lineHeight={"22.4px"}
          letterSpacing={"0.17px"}
        >
          {additionalInfoText}
        </Typography>

        {param && variant === "param" && (
          <FormParam
            variant="button"
            param={param}
          />
        )}

        {type === "choices" && choices?.length && <ChoicesButton message={message} />}
        {type === "code" && (
          <Stack>
            <CodeButton message={message} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default QuestionMessage;
