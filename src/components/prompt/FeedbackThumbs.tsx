import { Button, Stack } from "@mui/material";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { FeedbackType, TemplatesExecutions } from "@/core/api/dto/templates";
import { Happy } from "@/assets/icons/Happy";
import { Sad } from "@/assets/icons/Sad";
import { useState } from "react";

interface newFeedBack {
  execution: TemplatesExecutions;
}

const FeedbackThumbs: React.FC<newFeedBack> = ({ execution }) => {
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

  const liked = feedback === "LIKED";
  const disliked = feedback === "DISLIKED";

  console.log(execution);
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
    >
      <Button
        onClick={() => handleFeedback("LIKED")}
        variant="text"
        startIcon={<Happy />}
        sx={{
          height: "22px",
          p: "15px",
          fontSize: 13,
          fontWeight: 500,
          border: "1px solid",
          borderColor: liked ? "#ABE88F" : "divider",
          color: "secondary.main",
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        Good
      </Button>
      <Button
        onClick={() => handleFeedback("DISLIKED")}
        variant="text"
        startIcon={<Sad />}
        sx={{
          height: "22px",
          p: "15px",
          fontSize: 13,
          fontWeight: 500,
          border: "1px solid",
          borderColor: disliked ? "#FF624D" : "divider",
          color: "secondary.main",
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        Bad
      </Button>
    </Stack>
  );
};

export default FeedbackThumbs;
