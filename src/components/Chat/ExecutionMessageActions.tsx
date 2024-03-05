import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";
import { useAppSelector } from "@/hooks/useStore";
import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";
import ShareOutlined from "@mui/icons-material/ShareOutlined";

function ExecutionMessageActions() {
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  return (
    <>
      {!!selectedExecution && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {!!selectedExecution && (
            <FeedbackThumbs
              variant="icon"
              execution={selectedExecution!}
            />
          )}
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
          >
            <Typography
              fontSize={13}
              fontWeight={400}
              lineHeight={"28px"}
              color={"text.secondary"}
            >
              Saved as draft
            </Typography>
            <Button
              variant="text"
              startIcon={<CreateNewFolderOutlined />}
              sx={{
                color: "onSurface",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Save as document
            </Button>
            <Button
              variant="text"
              startIcon={<ShareOutlined />}
              sx={{
                color: "onSurface",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Export
            </Button>
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default ExecutionMessageActions;
