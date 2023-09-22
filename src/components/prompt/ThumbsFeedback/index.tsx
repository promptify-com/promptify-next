import { IconButton, Stack, Tooltip } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { TemplatesExecutions } from "@/core/api/dto/templates";

interface FeedBackType {
  selectedExecution: TemplatesExecutions | null;
}

const ThumbsFeedback: React.FC<FeedBackType> = ({ selectedExecution }) => {
  const [updateExecution] = useUpdateExecutionMutation();

  const isLiked = selectedExecution?.feedback === "LIKED";
  const isDisliked = selectedExecution?.feedback === "DISLIKED";

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
      ml={"auto"}
    >
      <Tooltip title="LIKE">
        <IconButton
          onClick={() => handleFeedback("LIKED")}
          sx={{
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
            },
            color: isLiked ? "success.main" : "initial",
          }}
        >
          <ThumbUp />
        </IconButton>
      </Tooltip>
      <Tooltip title="DISLIKE">
        <IconButton
          onClick={() => handleFeedback("DISLIKED")}
          sx={{
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
            },
            color: isDisliked ? "error.main" : "initial",
          }}
        >
          <ThumbDown />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ThumbsFeedback;
