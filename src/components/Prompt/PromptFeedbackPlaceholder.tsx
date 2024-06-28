import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import FeedbackPlaceholder from "@/components/placeholders/FeedbackPlaceholder";

export default function PromptFeedbackPlaceholder() {
  return (
    <Stack
      gap={2}
      p={{ xs: "10px 24px", md: "48px" }}
    >
      <Skeleton
        variant="text"
        width={"250px"}
        height={"30px"}
      />
      <Box
        sx={{
          width: "100%",
          borderRadius: "24px",
          bgcolor: "#F5F3F7",
          p: "16px",
        }}
      >
        <Skeleton
          variant="text"
          width={"200px"}
          height={"20px"}
        />
      </Box>

      <FeedbackPlaceholder />
    </Stack>
  );
}
