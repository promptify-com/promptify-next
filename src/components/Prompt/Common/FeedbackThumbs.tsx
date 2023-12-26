import { useState } from "react";
import Stack from "@mui/material/Stack";
import TagFacesSharp from "@mui/icons-material/TagFacesSharp";
import MoodBadSharp from "@mui/icons-material/MoodBadSharp";
import IconButton from "@mui/material/IconButton";
import { Replay } from "@mui/icons-material";

import { useUpdateExecutionMutation } from "@/core/api/executions";
import { FeedbackType, TemplatesExecutions } from "@/core/api/dto/templates";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { Tooltip } from "@mui/material";
import { setAnswers } from "@/core/store/chatSlice";
import { setRepeatedExecution } from "@/core/store/executionsSlice";
import CheckCircle from "@mui/icons-material/CheckCircle";

interface Props {
  execution: TemplatesExecutions;
  vertical?: boolean;
}

export default function FeedbackThumbs({ vertical, execution }: Props) {
  const [updateExecution] = useUpdateExecutionMutation();
  const dispatch = useAppDispatch();
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const activeSideBarLink = useAppSelector(state => state.template.activeSideBarLink);

  const [feedback, setFeedback] = useState(execution.feedback);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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
    const { parameters } = selectedExecution!;
    dispatch(setRepeatedExecution(selectedExecution));

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

    setTimeout(() => {
      const inputElement = document.getElementById("accordion-input");
      if (inputElement) {
        inputElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const commonPopperProps = {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -5],
        },
      },
    ],
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
            top: { xs: "140px", md: "180px" },
            right: activeSideBarLink ? "55%" : "45%",

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
        gap={1}
      >
        <Tooltip
          title="Good"
          arrow
          PopperProps={commonPopperProps}
        >
          <IconButton
            size="large"
            onClick={() => handleFeedback("LIKED")}
            sx={{
              p: "15px",
              border: "none",
              bgcolor: "surface.2",

              ":hover": {
                color: "green",
                bgcolor: "action.hover",
              },
            }}
          >
            <TagFacesSharp
              sx={{
                color: execution.feedback === "LIKED" ? "green" : "inherit",
              }}
            />
          </IconButton>
        </Tooltip>

        <Tooltip
          title="Bad"
          arrow
          PopperProps={commonPopperProps}
        >
          <IconButton
            size="large"
            onClick={() => handleFeedback("DISLIKED")}
            sx={{
              p: "15px",
              border: "none",
              bgcolor: "surface.2",

              ":hover": {
                color: "red",
                bgcolor: "action.hover",
              },
            }}
          >
            <MoodBadSharp
              sx={{
                color: execution.feedback === "DISLIKED" ? "red" : "inherit",
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Repeat"
          arrow
          PopperProps={commonPopperProps}
        >
          <IconButton
            size="large"
            onClick={handleRepeat}
            sx={{
              p: "15px",
              border: "none",
              bgcolor: "surface.2",

              ":hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Replay />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
}
