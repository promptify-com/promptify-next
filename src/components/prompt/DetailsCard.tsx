import { Templates } from '@/core/api/dto/templates';
import { AddOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, alpha, useTheme } from '@mui/material'
import React from 'react'

interface Props {
   templateData: Templates;
}

export const DetailsCard: React.FC<Props> = ({ 
   templateData
}) => {
   const { palette } = useTheme();

   return (
      <Stack gap={2}
       sx={{
         bgcolor: "surface.1",
         p: "16px"
      }}
      >
         <Box
            component={"img"}
            src={templateData.thumbnail || "http://placehold.it/240x150"}
            alt={templateData.title}
            sx={{
               height: 226,
               width: "100%",
               objectFit: "cover",
               borderRadius: "16px",
            }}
         />
         <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1}>
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
            <Button
              sx={{ 
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
              onClick={() => console.log("New Spark")}
            >
              Spark
            </Button>
         </Stack>
      </Stack>
  )
}