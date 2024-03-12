import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FolderDeleteOutlined from "@mui/icons-material/FolderDeleteOutlined";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { useMemo, useState } from "react";
import { SparkExportPopup } from "../../../dialog/SparkExportPopup";
import { Templates } from "@/core/api/dto/templates";
import { isDesktopViewPort } from "@/common/helpers";
import { setToast } from "@/core/store/toastSlice";
import { setSelectedExecution } from "@/core/store/executionsSlice";

interface Props {
  template: Templates;
}

function ExecutionMessageActions({ template }: Props) {
  const dispatch = useAppDispatch();
  const isDesktopView = isDesktopViewPort();

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const [openExportPopup, setOpenExportPopup] = useState(false);

  const activeExecution = useMemo(() => {
    if (selectedExecution) {
      return {
        ...selectedExecution,
        template: {
          ...selectedExecution.template,
          title: template.title,
          slug: template.slug,
          thumbnail: template.thumbnail,
        },
      };
    }
    return null;
  }, [selectedExecution]);

  const saveExecution = async () => {
    if (!!!selectedExecution) return;

    try {
      if (selectedExecution.is_favorite) {
        await deleteExecutionFavorite(selectedExecution.id);
        dispatch(
          setToast({
            message: "Your document has been deleted.",
            severity: "success",
          }),
        );
      } else {
        await favoriteExecution(selectedExecution.id);
        dispatch(
          setToast({
            message: "Your document has been saved.",
            severity: "success",
          }),
        );
      }

      const updateSelectedExecution = {
        ...selectedExecution,
        is_favorite: !selectedExecution.is_favorite,
      };

      dispatch(setSelectedExecution(updateSelectedExecution));
    } catch (error) {
      console.error(error);
    }
  };

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
            gap={1}
          >
            <Typography
              fontSize={13}
              fontWeight={400}
              lineHeight={"28px"}
              color={"text.secondary"}
            >
              {selectedExecution.is_favorite ? "Saved as document" : "Saved as draft"}
            </Typography>

            <Button
              variant="text"
              startIcon={selectedExecution.is_favorite ? <FolderDeleteOutlined /> : <CreateNewFolderOutlined />}
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
              {isDesktopView && <>{selectedExecution.is_favorite ? "Delete from documents" : "Save as document"}</>}
            </Button>
            <Button
              variant="text"
              startIcon={<ShareOutlined />}
              sx={{
                color: "onSurface",
                fontSize: { xs: 12, md: 16 },
                minWidth: { xs: "40px", md: "auto" },
                p: { xs: 1, md: "4px 20px" },
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => setOpenExportPopup(true)}
            >
              {isDesktopView && "Export"}
            </Button>
          </Stack>
        </Stack>
      )}

      {openExportPopup && selectedExecution?.id && (
        <SparkExportPopup
          onClose={() => setOpenExportPopup(false)}
          activeExecution={activeExecution}
        />
      )}
    </>
  );
}

export default ExecutionMessageActions;
