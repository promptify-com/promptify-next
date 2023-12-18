import { Button, Snackbar, Stack, alpha } from "@mui/material";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { FeedbackType, TemplatesExecutions } from "@/core/api/dto/templates";
import { Happy } from "@/assets/icons/Happy";
import { Sad } from "@/assets/icons/Sad";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Replay } from "@mui/icons-material";
import { theme } from "@/theme";
import { useAppSelector } from "@/hooks/useStore";
import { IAnswer } from "@/components/Prompt/Types/chat";
import { setAnswers } from "@/core/store/chatSlice";
import { setRepeatedExecution } from "@/core/store/executionsSlice";
import CheckCircle from "@mui/icons-material/CheckCircle";

interface newFeedBack {
  execution: TemplatesExecutions;
  vertical?: boolean;
  min?: boolean;
}

export const FeedbackActions: React.FC<newFeedBack> = ({ execution, vertical, min }) => {
  const [updateExecution] = useUpdateExecutionMutation();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedback, setFeedback] = useState(execution.feedback);
  const dispatch = useDispatch();
  const inputs = useAppSelector(state => state.chat.inputs);

  useEffect(() => setFeedback(execution.feedback), [execution]);

  const handleFeedback = (newFeedback: FeedbackType) => {
    if (feedback !== newFeedback) {
      setFeedback(newFeedback);

      const feedbackData = {
        id: execution.id,
        data: {
          feedback: newFeedback,
        },
      };
      updateExecution(feedbackData);

      setFeedbackMessage("Thank you for your Feedback");
      setTimeout(() => setFeedbackMessage(""), 2000);
    }
  };

  const handleRepeat = () => {
    dispatch(setRepeatedExecution(execution));
    let newAnswers: IAnswer[] = [];
    if (execution.parameters) {
      const _params = execution.parameters;
      newAnswers = inputs
        .map(input => {
          const { name: inputName, required, question, prompt } = input;
          const promptId = prompt!;
          const answer = _params[promptId][inputName];

          return {
            inputName,
            required,
            question: question || "",
            prompt: promptId,
            answer,
          };
        })
        .filter(answer => answer.answer !== "");
    }

    dispatch(setAnswers(newAnswers));
  };

  const liked = feedback === "LIKED";
  const disliked = feedback === "DISLIKED";

  return (
    <>
      {feedbackMessage && (
        <Stack
          gap={1}
          direction={"row"}
          alignItems={"center"}
          sx={{
            bgcolor: "primary.main",
            position: "fixed",
            top: "240px",
            right: "40%",

            color: "white",
            p: 1,
            borderRadius: "16px",
            fontSize: 12,
          }}
        >
          <CheckCircle sx={{ fontSize: 16 }} />
          {feedbackMessage}
        </Stack>
      )}
      <Stack
        direction={{ xs: "row", md: vertical ? "column" : "row" }}
        alignItems={"center"}
        flexWrap={"wrap"}
        gap={1}
      >
        <Button
          onClick={() => handleFeedback("LIKED")}
          variant="text"
          startIcon={<Happy />}
          sx={{
            ...buttonStyle,
            ...(min && minButtonStyle),
            border: liked ? "1px solid #ABE88F8F" : min ? "none" : "1px solid",
            bgcolor: liked ? "#ABE88F36" : min ? alpha(theme.palette.surface[5], 0.45) : "transparent",
          }}
        >
          {!min && "Good"}
        </Button>
        <Button
          onClick={() => handleFeedback("DISLIKED")}
          variant="text"
          startIcon={<Sad />}
          sx={{
            ...buttonStyle,
            ...(min && minButtonStyle),
            border: disliked ? "1px solid #FF624D8F" : min ? "none" : "1px solid",
            bgcolor: disliked ? "#FF624D36" : min ? alpha(theme.palette.surface[5], 0.45) : "transparent",
          }}
        >
          {!min && "Bad"}
        </Button>
        <Button
          onClick={() => handleRepeat()}
          variant="text"
          startIcon={<Replay />}
          sx={{
            ...buttonStyle,
            ...(min && minButtonStyle),
          }}
        >
          {!min && "Try again"}
        </Button>
      </Stack>
    </>
  );
};

const buttonStyle = {
  height: "22px",
  minWidth: "auto",
  p: "15px",
  fontSize: 13,
  fontWeight: 500,
  border: "1px solid",
  borderColor: "divider",
  color: "secondary.main",
  ":hover": {
    bgcolor: "action.hover",
  },
};

const minButtonStyle = {
  width: 49,
  height: 49,
  borderRadius: "50%",
  border: "none",
  bgcolor: alpha(theme.palette.surface[5], 0.45),
  ".MuiButton-startIcon": {
    m: 0,
  },
  ":hover": {
    bgcolor: alpha(theme.palette.surface[5], 0.8),
  },
};
