import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TagFacesSharp from "@mui/icons-material/TagFacesSharp";
import MoodBadSharp from "@mui/icons-material/MoodBadSharp";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { FeedbackType, TemplatesExecutions } from "@/core/api/dto/templates";
import { useState } from "react";

interface newFeedBack {
  execution: TemplatesExecutions;
}

export default function FeedbackThumbs({ execution }: newFeedBack) {
  const [updateExecution] = useUpdateExecutionMutation();
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

  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      gap={1}
    >
      <Button
        onClick={() => handleFeedback("LIKED")}
        variant="text"
        startIcon={<TagFacesSharp />}
        sx={{
          height: "22px",
          p: "15px",
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      />
      <Button
        onClick={() => handleFeedback("DISLIKED")}
        variant="text"
        startIcon={<MoodBadSharp />}
        sx={{
          height: "22px",
          p: "15px",
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      />
    </Stack>
  );
}
