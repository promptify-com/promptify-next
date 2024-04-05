import { useState } from "react";
import type { ExecutionTemplatePopupType, ExecutionWithTemplate } from "@/core/api/dto/templates";
import Button from "@mui/material/Button";
import { SparkSaveDeletePopup } from "@/components/dialog/SparkSaveDeletePopup";
import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import FolderDeleteOutlined from "@mui/icons-material/FolderDeleteOutlined";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import Edit from "@mui/icons-material/Edit";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setDocumentTitle, toggleShowPreviews } from "@/core/store/documentsSlice";
import { theme } from "@/theme";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";

interface Props {
  document: ExecutionWithTemplate;
  onFavorite?: (status: boolean) => void;
}

function ActionButtons({ document, onFavorite }: Props) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const showPreviews = useAppSelector(state => state.documents.showPreviews);
  const [popup, setPopup] = useState<ExecutionTemplatePopupType>(null);
  const [isFavorite, setIsFavorite] = useState(document.is_favorite);

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const saveExecution = async () => {
    const status = isFavorite;
    setIsFavorite(!isFavorite);
    onFavorite?.(!isFavorite);
    try {
      if (status) {
        await deleteExecutionFavorite(document.id);
      } else {
        await favoriteExecution(document.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack
      direction={{ md: "row" }}
      gap={{ xs: 1, md: 2 }}
      alignItems={{ xs: "flex-start", md: "center" }}
    >
      {isMobile && (
        <Button
          variant="text"
          startIcon={<Edit />}
          sx={btnStyle}
          onClick={() => setPopup("update")}
        >
          Rename
        </Button>
      )}
      <Button
        variant="text"
        startIcon={isFavorite ? <FolderDeleteOutlined /> : <CreateNewFolderOutlined />}
        sx={btnStyle}
        onClick={saveExecution}
      >
        {isFavorite ? "Delete from documents" : "Save as document"}
      </Button>
      <Button
        variant="text"
        startIcon={<ShareOutlined />}
        sx={btnStyle}
        onClick={() => setPopup("export")}
      >
        Export
      </Button>
      {isMobile && (
        <Button
          variant="text"
          startIcon={showPreviews ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
          sx={btnStyle}
          onClick={() => dispatch(toggleShowPreviews())}
        >
          {showPreviews ? "Hide" : "Show"} prompt inputs
        </Button>
      )}

      {(popup === "delete" || popup === "update") && (
        <SparkSaveDeletePopup
          type={popup}
          activeExecution={document}
          onClose={() => setPopup(null)}
          onUpdate={updateDocument => dispatch(setDocumentTitle(updateDocument.title))}
        />
      )}
      {popup === "export" && (
        <SparkExportPopup
          onClose={() => setPopup(null)}
          activeExecution={document}
        />
      )}
    </Stack>
  );
}

export default ActionButtons;

const btnStyle = {
  border: { md: `1px solid ${theme.palette.surfaceContainerHigh}` },
  p: "8px 24px",
  fontSize: 14,
  fontWeight: 500,
  color: "onSurface",
  ":hover": {
    bgcolor: "surfaceContainerHigh",
  },
};
