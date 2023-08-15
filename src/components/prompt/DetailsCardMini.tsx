import { Templates } from '@/core/api/dto/templates';
import { AddOutlined, Favorite, FavoriteOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, alpha, useTheme } from '@mui/material'
import React from 'react'

interface Props {
   templateData: Templates;
   onNewSpark?: () => void;
}

export const DetailsCardMini: React.FC<Props> = ({ 
   templateData,
   onNewSpark,
}) => {
   const { palette } = useTheme();

   return (
      <Stack gap={2} direction={"row"}
       sx={{
         bgcolor: "surface.1",
         p: "10px 14px",
         width: `calc(100% - 28px)`,
         height: "fit-content",
         borderTop: `1px solid ${palette.surface[3]}`,
         borderBottom: `1px solid ${palette.surface[3]}`,
      }}
      >
         <Box
            component={"img"}
            src={templateData.thumbnail || "http://placehold.it/240x150"}
            alt={templateData.title}
            sx={{
               height: 42,
               width: 56,
               objectFit: "cover",
               borderRadius: "99px",
            }}
         />
         <Stack 
            direction={"row"} 
            alignItems={"center"} 
            justifyContent={"space-between"} 
            flex={1}
            gap={1}
         >
            <Box>
               <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={"onSurface"}
                  dangerouslySetInnerHTML={{ __html: templateData.title }}
               />
               <Typography
                  fontSize={10}
                  fontWeight={400}
                  color={"grey.600"}
                  dangerouslySetInnerHTML={{ __html: templateData.category.name }}
               />
            </Box>
            <Typography sx={{
                  p: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
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
            <Button
              sx={{ 
                  display: { xs: "none", md: "flex" },
                  p: "6px 16px",
                  bgcolor: "transparent",
                  color: "primary.main",
                  fontSize: 14,
                  border: `1px solid ${alpha(palette.primary.main, .3)}`,
                  "&:hover": {
                     bgcolor: "action.hover",
                     color: "primary.main"
                  }
               }}
              startIcon={<AddOutlined />}
              variant={"outlined"}
              onClick={onNewSpark}
            >
              Spark
            </Button>
         </Stack>
      </Stack>
  )
}