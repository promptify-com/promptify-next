import { memo } from "react";
import { SxProps } from "@mui/system";
import Button from "@mui/material/Button";
import useSaveFavoriteTemplate from "@/hooks/useSaveFavoriteTemplate";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";

interface Props {
  style?: { sx: SxProps };
}

const FavoriteButton: React.FC<Props> = ({ style = { sx: {} } }) => {
  const [saveFavoriteTemplate, { templateData }] = useSaveFavoriteTemplate();

  return (
    <Button
      onClick={saveFavoriteTemplate}
      startIcon={templateData.is_favorite ? <Bookmark /> : <BookmarkBorder />}
      sx={{
        border: "1px solid",
        borderColor: "surfaceContainerHigh",
        borderRadius: "99px",
        p: "8px 16px",
        fontSize: 14,
        fontWeight: 500,
        gap: 0.5,
        color: "onSurface",
        ":hover": {
          bgcolor: "surfaceContainerHigh",
        },
        ...style?.sx,
      }}
    >
      {templateData.is_favorite ? "Remove" : "Save"}
    </Button>
  );
};

export default memo(FavoriteButton);
