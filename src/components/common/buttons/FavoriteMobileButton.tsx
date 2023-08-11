import React from 'react'
import { Box, Button, alpha, useTheme } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material';

interface Props {
   isFavorite: boolean;
   onClick: () => void;
   likes: number;
}


export const FavoriteMobileButton:React.FC<Props> = ({ isFavorite, onClick, likes }) => {
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
            },           
         }}
         variant={"outlined"}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onClick={onClick}
      >
         {isFavorite ? (
            "Favorite " 
         ) : (
            "Add To Favorite "
         )}
         {isFavorite ? 
         <Favorite sx={{ pr: '5px', pl: '70px' }} /> 
         : <Favorite sx={{ pr: '5px', pl: '20px' }} />}
         {likes}
      </Button>
   )
}

export default FavoriteMobileButton