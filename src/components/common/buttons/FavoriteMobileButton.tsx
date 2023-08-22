import { Button, alpha, useTheme } from "@mui/material";
import { Favorite, FavoriteBorder, FavoriteOutlined } from "@mui/icons-material";

interface Props {
  isFavorite: boolean;
  onClick: () => void;
  likes: number;
}

export const FavoriteMobileButton: React.FC<Props> = ({ isFavorite, onClick, likes }) => {
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
      onClick={onClick}
    >
      {isFavorite ? "Favorite " : "Add To Favorite "}
      {isFavorite ? <Favorite sx={{ ml: "auto", mr: "5px" }} /> : <FavoriteBorder sx={{ ml: "auto", mr: "5px" }} />}
      {likes}
    </Button>
  );
};

export default FavoriteMobileButton;
