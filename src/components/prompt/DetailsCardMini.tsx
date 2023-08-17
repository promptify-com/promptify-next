import { Templates } from '@/core/api/dto/templates';
import { AddOutlined, Favorite, FavoriteOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Stack, Typography, alpha, useTheme } from '@mui/material'
import React from 'react'

interface Props {
   templateData: Templates;
}

export const DetailsCardMini: React.FC<Props> = ({ 
   templateData,
}) => {
   const { palette } = useTheme();

   return (
      <Box sx={{ 
            width: "100%", 
            p: "8px",
            bgcolor: alpha(palette.surface[1], .8),
         }}
      >
         <Stack gap={1} direction={"row"} alignItems={"center"} justifyContent={"space-between"}
            sx={{
               bgcolor: alpha(palette.surface[4], .6),
               p: "8px",
               height: "fit-content",
               borderRadius: "16px"
            }}
         >
            <Box
               component={"img"}
               src={templateData.thumbnail || "http://placehold.it/240x150"}
               alt={templateData.title}
               sx={{
                  height: 54,
                  width: 72,
                  objectFit: "cover",
                  borderRadius: "16px",
               }}
            />
            <Box>
               <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={"onSurface"}
                  dangerouslySetInnerHTML={{ __html: templateData.title }}
               />
            </Box>
            <Typography sx={{
                  p: "6px 11px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "primary.main",
                  "svg": {
                     width: 24,
                     height: 24,
                  }
               }}
            >
               {templateData.is_favorite ? <Favorite /> : <FavoriteOutlined />}
               {templateData.favorites_count}
            </Typography>
            <Avatar
               src={templateData.created_by.avatar}
               alt={templateData.created_by.username}
               sx={{ width: 40, height: 40 }}
            />
         </Stack>
      </Box>
  )
}