import { useState } from "react";
import Stack from "@mui/material/Stack";
import TagFacesSharp from "@mui/icons-material/TagFacesSharp";
import MoodBadSharp from "@mui/icons-material/MoodBadSharp";
import IconButton from "@mui/material/IconButton";
import { Replay } from "@mui/icons-material";

import { useUpdateExecutionMutation } from "@/core/api/executions";
import { FeedbackType, TemplatesExecutions } from "@/core/api/dto/templates";
import { useAppDispatch } from "@/hooks/useStore";
import { setAccordionChatMode } from "@/core/store/templatesSlice";
import { Tooltip } from "@mui/material";
import { setSelectedExecution } from "@/core/store/executionsSlice";

interface newFeedBack {
  execution: TemplatesExecutions;
}

export default function FeedbackThumbs({ execution }: newFeedBack) {
  const [updateExecution] = useUpdateExecutionMutation();
  const dispatch = useAppDispatch();
  const [feedback, setFeedback] = useState(execution.feedback);
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

  const handleRepeat = () => {
    dispatch(setAccordionChatMode("repeat"));

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
    <Stack
      direction={{ xs: "row", md: "column" }}
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
  );
}
