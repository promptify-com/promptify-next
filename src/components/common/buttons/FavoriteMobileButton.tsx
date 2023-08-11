import React from 'react'
import { Button, alpha, useTheme } from '@mui/material';
import { Favorite } from '@mui/icons-material';

interface Props {
   isFavorite: boolean;
   onClick: () => void;
   likes: number;
}


export const FavoriteMobileButton:React.FC<Props> = ({ isFavorite, onClick, likes }) => {
   const { palette } = useTheme();
   
   return (
      <Button
         sx={{ 
            width: { xs: "100%", md: "auto" },
            p: "6px 16px",
            bgcolor: "transparent",
            color: palette.primary.main,
            fontSize: 14,
            borderColor: alpha(palette.primary.main, .3),
            "&:hover": {
              color: palette.primary.main,
              borderColor: alpha(palette.primary.main, .8),
            },           
         }}
         variant={"outlined"}
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