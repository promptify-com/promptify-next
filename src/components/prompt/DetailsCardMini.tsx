import React from "react";
import { Templates } from "@/core/api/dto/templates";
import { Avatar, Box, Stack, Typography, alpha, useTheme, Chip } from "@mui/material";
import FavoriteIcon from "./FavoriteIcon";

interface Props {
  templateData: Templates;
}

const favoriteIconStyle = {
  sx: {
    color: "primary.main",
    flexDirection: "column",
  },
};

export const DetailsCardMini: React.FC<Props> = ({ templateData }) => {
  const { palette } = useTheme();

  const templateStatus = templateData?.status !== "PUBLISHED" && (
    <Chip
      label={templateData?.status}
      size="small"
      sx={{ fontSize: "12px", fontWeight: 500, ml: "8px" }}
      component={"span"}
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        p: "8px",
        bgcolor: alpha(palette.surface[1], 0.8),
      }}
    >
      <Stack
        gap={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          bgcolor: alpha(palette.surface[4], 0.6),
          p: "8px",
          height: "fit-content",
          borderRadius: "16px",
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
          >
            {templateData.title}
            {templateStatus}
          </Typography>
        </Box>
        <FavoriteIcon style={favoriteIconStyle} />
        <Avatar
          src={templateData.created_by?.avatar}
          alt={templateData.created_by?.username}
          sx={{ width: 40, height: 40 }}
        />
      </Stack>
    </Box>
  );
};
