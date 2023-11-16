import { Button, Stack } from "@mui/material";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { Happy } from "@/assets/icons/Happy";
import { Sad } from "@/assets/icons/Sad";

interface FeedBackType {
  selectedExecution: TemplatesExecutions | null;
}

const ThumbsFeedback: React.FC<FeedBackType> = ({ selectedExecution }) => {
  const [updateExecution] = useUpdateExecutionMutation();

  const handleFeedback = (feedbackType: string) => {
    if (selectedExecution && selectedExecution?.feedback !== feedbackType) {
      const feedbackData = {
        id: selectedExecution.id,
        data: {
          feedback: feedbackType,
        },
      };
      updateExecution(feedbackData);
    }
  };

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
          borderColor: "divider",
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
          borderColor: "divider",
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

export default ThumbsFeedback;
