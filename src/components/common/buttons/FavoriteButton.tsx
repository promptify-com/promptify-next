import React from 'react'
import { Button, alpha, useTheme } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material';

interface Props {
   isFavorite: boolean;
   onClick: () => void;
}

export const FavoriteButton:React.FC<Props> = ({ isFavorite, onClick }) => {
   const { palette } = useTheme();
   const [isHovered, setIsHovered] = React.useState(false);

   const color = isFavorite && isHovered ? palette.error.main : palette.primary.main;

   return (
      <Button
         sx={{ 
            width: { xs: "100%", md: "auto" },
            p: "6px 16px",
            bgcolor: "transparent",
            color: color,
            fontSize: 14,
            borderColor: alpha(color, .3),
            "&:hover": {
              bgcolor: "action.hover",
              color: color,
              borderColor: alpha(color, .8),
            }
         }}
         startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
         variant={"outlined"}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onClick={onClick}
      >
         {isFavorite ? (
            isHovered ? "Remove From Favorites" : "In Favorites" 
         ): (
            "Add To Favorites"
         )}
      </Button>
   )
}

export default FavoriteButton