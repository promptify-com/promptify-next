import { Templates } from "@/core/api/dto/templates";
import { Favorite, FavoriteOutlined } from "@mui/icons-material";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";

interface Props {
  templateData: Templates;
}

export const DetailsCard: React.FC<Props> = ({ templateData }) => {
  return (
    <Stack
      gap={2}
      direction={"column"}
      sx={{
        bgcolor: "surface.1",
        p: { xs: "0px", md: "16px" },
        width: `calc(100% - ${{ xs: 0, md: 32 }}px)`,
        height: "fit-content",
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
          borderRadius: { xs: "0px", md: "16px" },
        }}
      />
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flex={1}
        gap={1}
        sx={{
          borderTopLeftRadius: "25px",
          borderTopRightRadius: "25px",
          mt: { xs: "-35px", md: "0px" },
          bgcolor: "surface.1",
        }}
      >
        <Box
          pt={{ xs: "15px", md: "0px" }}
          paddingX={{ xs: "16px", md: "0px" }}
        >
          <Typography
            fontSize={18}
            fontWeight={500}
            color={"onSurface"}
            dangerouslySetInnerHTML={{ __html: templateData.title }}
          />
          <Typography
            fontSize={12}
            fontWeight={500}
            color={"grey.600"}
            dangerouslySetInnerHTML={{ __html: templateData.category.name }}
          />
        </Box>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
        >
          <Typography
            sx={{
              p: "6px 11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              fontSize: 15,
              fontWeight: 500,
              color: "onSurface",
              svg: {
                width: 24,
                height: 24,
              },
            }}
          >
            {templateData.is_favorite ? <Favorite /> : <FavoriteOutlined />}
            {templateData.favorites_count}
          </Typography>
          <Avatar
            src={templateData.created_by.avatar}
            alt={templateData.created_by.username}
            sx={{ width: 32, height: 32 }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
