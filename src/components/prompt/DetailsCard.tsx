import { Templates } from '@/core/api/dto/templates';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

interface Props {
   templateData: Templates;
   detailsOpened: boolean;
   toggleDetails: () => void;
}

export const DetailsCard: React.FC<Props> = ({ 
   templateData,
   detailsOpened,
   toggleDetails 
}) => {

   return (
      <Stack direction={"row"} gap={2} alignItems={"center"}
         sx={{
            display: { xs: "none", md: "flex" },
            bgcolor: "surface.1",
            p: "16px",
            borderRadius: "16px",
            cursor: "pointer",
            "&:hover": {
               bgcolor: "action.hover",
            },
         }}
         onClick={toggleDetails}
      >
      <Box
         component={"img"}
         src={templateData.thumbnail || "http://placehold.it/240x150"}
         alt={templateData.title}
         sx={{
            width: 64,
            height: 48,
            objectFit: "cover",
            borderRadius: "16px",
         }}
      />
      <Box>
         <Typography
            fontSize={14}
            color={"onSurface"}
            dangerouslySetInnerHTML={{ __html: templateData.title }}
         />
         <Typography
            fontSize={12}
            color={"grey.600"}
            dangerouslySetInnerHTML={{ __html: templateData.category.name }}
         />
      </Box>
      <Box sx={{ ml: "auto", p: "8px" }}>
         {detailsOpened ? <ArrowDropUp /> : <ArrowDropDown />}
      </Box>
   </Stack>
  )
}