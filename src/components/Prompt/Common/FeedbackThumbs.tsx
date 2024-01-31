import { useState } from "react";
import Stack from "@mui/material/Stack";
import TagFacesSharp from "@mui/icons-material/TagFacesSharp";
import MoodBadSharp from "@mui/icons-material/MoodBadSharp";
import Button from "@mui/material/Button";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { Replay } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers } from "@/core/store/chatSlice";
import { setRepeatedExecution } from "@/core/store/executionsSlice";
import { theme } from "@/theme";
import { Happy } from "@/assets/icons/Happy";
import { Sad } from "@/assets/icons/Sad";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import CustomTooltip from "@/components/common/CustomTooltip";
import type { FeedbackType, TemplatesExecutions } from "@/core/api/dto/templates";

interface Props {
  variant: "button" | "icon";
  execution: TemplatesExecutions;
  vertical?: boolean;
}

export default function FeedbackThumbs({ vertical, execution, variant }: Props) {
  const [updateExecution] = useUpdateExecutionMutation();
  const dispatch = useAppDispatch();
  const { isVariantB } = useVariant();

  const activeSideBarLink = useAppSelector(state => state.template.activeSideBarLink);

  const [feedback, setFeedback] = useState(execution.feedback);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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
      setFeedbackMessage("Thank you for your Feedback");
      setTimeout(() => setFeedbackMessage(""), 2000);
    }
  };

  const handleRepeat = () => {
    const { parameters } = execution;
    dispatch(setRepeatedExecution(execution));

    const newAnswers = parameters
      ? Object.keys(parameters)
          .map(promptId => {
            const param = parameters[promptId];
            return Object.keys(param).map(inputName => ({
              inputName: inputName,
              required: true,
              question: "",
              answer: param[inputName],
              prompt: parseInt(promptId),
              error: false,
            }));
          })
          .flat()
      : [];
    dispatch(setAnswers(newAnswers));

    if (isVariantB) {
      setTimeout(() => {
        const inputElement = document.getElementById("accordion-input");
        if (inputElement) {
          inputElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
  };

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
            top: { xs: isVariantB ? "140px" : "240px", md: isVariantB ? "180px" : "240px" },
            right: { md: isVariantB && activeSideBarLink ? "55%" : !isVariantB && !activeSideBarLink ? "27%" : "45%" },
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
        <CustomTooltip title={isIconVariant && "Good"}>
          <Button
            onClick={() => handleFeedback("LIKED")}
            variant="text"
            startIcon={
              isVariantB ? (
                <TagFacesSharp
                  sx={{
                    color: liked ? "green" : "inherit",
                  }}
                />
              ) : (
                <Happy />
              )
            }
            sx={{
              ...buttonStyle,
              ...(isIconVariant && minButtonStyle),
              border: !isVariantB && liked ? "1px solid #ABE88F8F" : true ? "none" : "1px solid",
              bgcolor:
                !isVariantB && liked ? "#ABE88F36" : true ? alpha(theme.palette.surface[5], 0.45) : "transparent",
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
              isVariantB ? (
                <MoodBadSharp
                  sx={{
                    color: disliked ? "red" : "inherit",
                  }}
                />
              ) : (
                <Sad />
              )
            }
            sx={{
              ...buttonStyle,
              ...(isIconVariant && minButtonStyle),
              border: !isVariantB && disliked ? "1px solid #FF624D8F" : true ? "none" : "1px solid",
              bgcolor:
                !isVariantB && disliked ? "#FF624D36" : true ? alpha(theme.palette.surface[5], 0.45) : "transparent",
            }}
          >
            {!isIconVariant && "Bad"}
          </Button>
        </CustomTooltip>
        <CustomTooltip title={isIconVariant && "Repeat"}>
          <Button
            onClick={() => handleRepeat()}
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
      </Stack>
    </>
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
