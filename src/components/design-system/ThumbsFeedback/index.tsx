import { IconButton, Stack, Tooltip } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import { TemplatesExecutions } from "@/core/api/dto/templates";

interface FeedBackType {
  selectedExecution: TemplatesExecutions | null;
}

const ThumbsFeedback: React.FC<FeedBackType> = ({ selectedExecution }) => {
  const [updateExecution] = useUpdateExecutionMutation();

  const handleFeedback = (feedbackType: string) => {
    if (selectedExecution) {
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
    selectedExecution?.id && (
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
              color: selectedExecution?.feedback === "LIKED" ? "success.main" : "initial",
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
              color: selectedExecution?.feedback === "DISLIKED" ? "error.main" : "initial",
            }}
          >
            <ThumbDown />
          </IconButton>
        </Tooltip>
      </Stack>
    )
  );
};

export default ThumbsFeedback;
