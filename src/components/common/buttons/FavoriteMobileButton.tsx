import { memo } from "react";
import { Button, alpha, useTheme } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import useSaveFavoriteTemplate from "@/hooks/useSaveFavoriteTemplate";

export const FavoriteMobileButton = () => {
  const [saveFavoriteTemplate, { templateData }] = useSaveFavoriteTemplate();
  const { palette } = useTheme();

  return (
    <Button
      sx={{
        flex: "auto",
        p: "8px 16px",
        bgcolor: "transparent",
        color: palette.primary.main,
        fontSize: 14,
        borderColor: alpha(palette.primary.main, 0.3),
        "&:hover": {
          color: palette.primary.main,
          borderColor: alpha(palette.primary.main, 0.8),
        },
      }}
      variant={"outlined"}
      onClick={saveFavoriteTemplate}
    >
      {templateData.is_favorite ? "Favorite " : "Add To Favorite "}
      {templateData.is_favorite ? (
        <Favorite sx={{ ml: "auto", mr: "5px" }} />
      ) : (
        <FavoriteBorder sx={{ ml: "auto", mr: "5px" }} />
      )}
      {templateData.likes}
    </Button>
  );
};

export default memo(FavoriteMobileButton);
