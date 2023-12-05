import { Button, Stack, alpha } from "@mui/material";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { FeedbackType, TemplatesExecutions } from "@/core/api/dto/templates";
import { Happy } from "@/assets/icons/Happy";
import { Sad } from "@/assets/icons/Sad";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setRepeatExecution } from "@/core/store/templatesSlice";
import { Replay } from "@mui/icons-material";
import { theme } from "@/theme";

interface newFeedBack {
  execution: TemplatesExecutions;
  vertical?: boolean;
  min?: boolean;
}

export const FeedbackActions: React.FC<newFeedBack> = ({ execution, vertical, min }) => {
  const [updateExecution] = useUpdateExecutionMutation();
  const [feedback, setFeedback] = useState(execution.feedback);
  const dispatch = useDispatch();

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
    }
  };

  const handleRepeat = (execution: TemplatesExecutions) => {
    dispatch(setRepeatExecution(execution));
  };

  const liked = feedback === "LIKED";
  const disliked = feedback === "DISLIKED";

  return (
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
        onClick={() => handleRepeat(execution)}
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
