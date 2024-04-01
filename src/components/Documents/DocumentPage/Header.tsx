import Stack from "@mui/material/Stack";
import type { ExecutionTemplatePopupType, ExecutionWithTemplate } from "@/core/api/dto/templates";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { useState } from "react";
import { SparkSaveDeletePopup } from "../../dialog/SparkSaveDeletePopup";
import { SparkExportPopup } from "../../dialog/SparkExportPopup";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import FolderDeleteOutlined from "@mui/icons-material/FolderDeleteOutlined";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "../../../core/api/executions";
import CloudDone from "@mui/icons-material/CloudDone";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";

interface Props {
  document: ExecutionWithTemplate;
}

function Header({ document }: Props) {
  const [popup, setPopup] = useState<ExecutionTemplatePopupType>(null);
  const [isFavorite, setIsFavorite] = useState(document.is_favorite);

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const saveExecution = async () => {
    const status = isFavorite;
    setIsFavorite(!isFavorite);
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
      direction={"row"}
      alignItems={"center"}
      gap={2}
      p={"24px 32px"}
    >
      <Stack
        flex={1}
        gap={1}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
        >
          <Typography
            fontSize={16}
            fontWeight={500}
            color={"onSurface"}
          >
            {document.title}
          </Typography>
          <IconButton
            onClick={() => setPopup("update")}
            sx={{ border: "none", svg: { fontSize: 16 } }}
          >
            <Edit />
          </IconButton>
        </Stack>
        <Typography
          fontSize={13}
          fontWeight={400}
          lineHeight={"28px"}
          color={"text.secondary"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {isFavorite ? (
            <>
              <CloudDone color="primary" />
              Saved as document
            </>
          ) : (
            <>
              <ScheduleOutlined sx={{ color: "secondary.light" }} />
              Saved as draft
            </>
          )}
        </Typography>
      </Stack>
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

      {(popup === "delete" || popup === "update") && (
        <SparkSaveDeletePopup
          type={popup}
          activeExecution={document}
          onClose={() => setPopup(null)}
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

export default Header;

const btnStyle = {
  border: "1px solid",
  borderColor: "surfaceContainerHigh",
  p: "8px 24px",
  fontSize: 14,
  fontWeight: 500,
  color: "onSurface",
  ":hover": {
    bgcolor: "surfaceContainerHigh",
  },
};
