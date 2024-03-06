import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";
import { useAppSelector } from "@/hooks/useStore";
import FeedbackThumbs from "@/components/Prompt/Common/FeedbackThumbs";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { useMemo, useState } from "react";
import { SparkExportPopup } from "../../../dialog/SparkExportPopup";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
}

function ExecutionMessageActions({ template }: Props) {
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

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
      } else {
        await favoriteExecution(selectedExecution.id);
      }
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
            {!selectedExecution.is_favorite && (
              <Typography
                fontSize={13}
                fontWeight={400}
                lineHeight={"28px"}
                color={"text.secondary"}
              >
                Saved as draft
              </Typography>
            )}

            <Button
              variant="text"
              startIcon={<CreateNewFolderOutlined />}
              sx={{
                color: "onSurface",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={saveExecution}
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
              onClick={() => setOpenExportPopup(true)}
            >
              Export
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
