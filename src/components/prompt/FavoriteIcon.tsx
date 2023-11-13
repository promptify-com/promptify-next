import { memo } from "react";
import { Typography, SxProps } from "@mui/material";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import useSaveFavoriteTemplate from "@/hooks/useSaveFavoriteTemplate";

interface Props {
  style?: { sx: SxProps };
}

const FavoriteIcon: React.FC<Props> = ({ style = { sx: {} } }) => {
  const [saveFavoriteTemplate, { templateData }] = useSaveFavoriteTemplate();

  return (
    <Typography
      sx={{
        p: "6px 11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        fontWeight: 500,
        color: "primary.main",
        cursor: "pointer",
        svg: {
          width: 24,
          height: 24,
        },
        ...style?.sx,
      }}
      onClick={saveFavoriteTemplate}
    >
      {templateData.is_favorite ? <Favorite /> : <FavoriteBorder />}
      {templateData.likes}
    </Typography>
  );
};

export default memo(FavoriteIcon);
