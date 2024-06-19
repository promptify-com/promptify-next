import { memo } from "react";
import { SxProps } from "@mui/system";
import Button from "@mui/material/Button";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import useSaveFavoriteTemplate from "@/hooks/useSaveFavoriteTemplate";

interface Props {
  style?: { sx: SxProps };
}

const LikeButton: React.FC<Props> = ({ style = { sx: {} } }) => {
  const { saveFavorite, templateData } = useSaveFavoriteTemplate();

  return (
    <Button
      onClick={() => saveFavorite(true)}
      startIcon={templateData.is_liked ? <Favorite /> : <FavoriteBorder />}
      disabled={Object.keys(templateData).length === 0}
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
      {templateData.likes}
    </Button>
  );
};

export default memo(LikeButton);
