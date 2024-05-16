import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FolderDeleteOutlined from "@mui/icons-material/FolderDeleteOutlined";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";

import { useAppDispatch } from "@/hooks/useStore";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { setToast } from "@/core/store/toastSlice";
import { setCurrentExecutionDetails } from "@/core/store/chatSlice";
import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";
import ExportExecutionButton from "@/components/Chat/Messages/ExecutionMessageBox/ExportExecutionButton";
import type { TemplatesExecutions } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  execution?: TemplatesExecutions;
}

function ExecutionMessageActions({ execution }: Props) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const saveExecution = async () => {
    if (!!!execution) return;

    try {
      if (execution.is_favorite) {
        await deleteExecutionFavorite(execution.id);
        dispatch(
          setToast({
            message: "Your document has been deleted.",
            severity: "success",
          }),
        );
      } else {
        await favoriteExecution(execution.id);
        dispatch(
          setToast({
            message: "Your document has been saved.",
            severity: "success",
          }),
        );
      }

      const updateSelectedExecution = {
        id: execution.id,
        isFavorite: !execution.is_favorite,
      };

      dispatch(setCurrentExecutionDetails(updateSelectedExecution));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!!execution && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {!!execution && (
            <FeedbackThumbs
              variant="icon"
              execution={execution}
            />
          )}
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <Typography
              fontSize={13}
              fontWeight={400}
              lineHeight={"28px"}
              color={"text.secondary"}
            >
              {execution.is_favorite ? "Saved as document" : "Saved as draft"}
            </Typography>

            <Button
              variant="text"
              startIcon={execution.is_favorite ? <FolderDeleteOutlined /> : <CreateNewFolderOutlined />}
              sx={{
                color: "onSurface",
                fontSize: { xs: 12, md: 16 },
                minWidth: { xs: "40px", md: "auto" },
                p: { xs: 1, md: "4px 20px" },
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={saveExecution}
            >
              {!isMobile && <>{execution.is_favorite ? "Delete from documents" : "Save"}</>}
            </Button>
            <ExportExecutionButton execution={execution} />
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default ExecutionMessageActions;
