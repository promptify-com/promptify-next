import { useState } from "react";
import Stack from "@mui/material/Stack";
import TagFacesSharp from "@mui/icons-material/TagFacesSharp";
import MoodBadSharp from "@mui/icons-material/MoodBadSharp";
import Button from "@mui/material/Button";
import Replay from "@mui/icons-material/Replay";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import CustomTooltip from "./CustomTooltip";
import { setToast } from "@/core/store/toastSlice";
import type { FeedbackType, TemplatesExecutions } from "@/core/api/dto/templates";
import { repeatExecution } from "@/components/Prompt/Utils";

interface Props {
  variant: "button" | "icon";
  execution: TemplatesExecutions;
  vertical?: boolean;
  noRepeat?: boolean;
}

export default function FeedbackThumbs({ vertical, execution, variant, noRepeat }: Props) {
  const [updateExecution] = useUpdateExecutionMutation();
  const dispatch = useAppDispatch();

  const [feedback, setFeedback] = useState(execution.feedback);
  const selectedTemplate = useAppSelector(state => state.chat.selectedTemplate);

  const liked = feedback === "LIKED";
  const disliked = feedback === "DISLIKED";
  const isIconVariant = variant === "icon";

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
      dispatch(setToast({ message: "Thank you for your Feedback", severity: "success" }));
    }
  };

  const handleRepeat = () => {
    repeatExecution(execution, !selectedTemplate, dispatch);
  };

  return (
    <Stack
      direction={{ xs: "row", md: vertical ? "column" : "row" }}
      alignItems={"center"}
      gap={1}
    >
      <CustomTooltip title={isIconVariant && "Good"}>
        <Button
          onClick={() => handleFeedback("LIKED")}
          variant="text"
          startIcon={
            <TagFacesSharp
              sx={{
                color: liked ? "green" : "inherit",
              }}
            />
          }
          sx={{
            ...buttonStyle,
            ...(isIconVariant && minButtonStyle),
            border: "none",
            bgcolor: "transparent",
          }}
        >
          {!isIconVariant && "Good"}
        </Button>
      </CustomTooltip>
      <CustomTooltip title={isIconVariant && "Sad"}>
        <Button
          onClick={() => handleFeedback("DISLIKED")}
          variant="text"
          startIcon={
            <MoodBadSharp
              sx={{
                color: disliked ? "red" : "inherit",
              }}
            />
          }
          sx={{
            ...buttonStyle,
            ...(isIconVariant && minButtonStyle),
            border: "none",
            bgcolor: "transparent",
          }}
        >
          {!isIconVariant && "Bad"}
        </Button>
      </CustomTooltip>
      {!noRepeat && (
        <CustomTooltip title={isIconVariant && "Repeat"}>
          <Button
            onClick={handleRepeat}
            variant="text"
            startIcon={<Replay />}
            sx={{
              ...buttonStyle,
              ...(isIconVariant && minButtonStyle),
            }}
          >
            {!isIconVariant && "Try again"}
          </Button>
        </CustomTooltip>
      )}
    </Stack>
  );
}

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
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  bgcolor: "transparent",
  ".MuiButton-startIcon": {
    m: 0,
  },
  ":hover": {
    bgcolor: "action.hover",
  },
};
