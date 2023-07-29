import { Templates } from '@/core/api/dto/templates';
import { AddOutlined, Favorite, FavoriteOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, alpha, useTheme } from '@mui/material'
import React from 'react'

interface Props {
   templateData: Templates;
   resetNewExecution?: () => void;
   min?: boolean;
}

export const DetailsCard: React.FC<Props> = ({ 
   templateData,
   resetNewExecution,
   min = false
}) => {
   const { palette } = useTheme();

   return (
      <Stack gap={2} direction={min ? "row" : "column"}
       sx={{
         bgcolor: "surface.1",
         p: min ? "10px 14px" : "16px",
         width: `calc(100% - ${min ? 28 : 32}px)`,
         height: "fit-content",
         borderTop: min ? `1px solid ${palette.surface[3]}` : "none",
         borderBottom: min ? `1px solid ${palette.surface[3]}` : "none",
      }}
      >
         <Box
            component={"img"}
            src={templateData.thumbnail || "http://placehold.it/240x150"}
            alt={templateData.title}
            sx={{
               height: min ? 42 : 226,
               width: min ? 56 : "100%",
               objectFit: "cover",
               borderRadius: min ? "99px" : "16px",
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
                  fontSize={min ? 14 : 18}
                  fontWeight={500}
                  color={"onSurface"}
                  dangerouslySetInnerHTML={{ __html: templateData.title }}
               />
               <Typography
                  fontSize={min ? 10 : 12}
                  fontWeight={min ? 400 : 500}
                  color={"grey.600"}
                  dangerouslySetInnerHTML={{ __html: templateData.category.name }}
               />
            </Box>
            {min && (
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
              {templateData.likes}
            </Typography>
            )}
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
              onClick={resetNewExecution}
            >
              Spark
            </Button>
         </Stack>
      </Stack>
  )
}