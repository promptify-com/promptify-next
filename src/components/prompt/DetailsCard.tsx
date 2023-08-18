import { Templates } from "@/core/api/dto/templates";
import { Favorite, FavoriteOutlined } from "@mui/icons-material";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";

interface Props {
  templateData: Templates;
}

export const DetailsCard: React.FC<Props> = ({ templateData }) => {
  return (
    <Box
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
        gap={2}
        sx={{
          borderTopLeftRadius: "25px",
          borderTopRightRadius: "25px",
          position: "relative",
          mt: { xs: "-35px", md: "0px" },
          bgcolor: "surface.1",
          p: { xs: "16px", md: 0 },
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          gap={1}
        >
          <Box>
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
            sx={{ display: { xs: "none", md: "flex" } }}
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
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
          sx={{ display: { md: "none" } }}
        >
          <Avatar
            src={templateData.created_by.avatar}
            alt={templateData.created_by.username}
            sx={{ width: 32, height: 32 }}
          />
          <Typography fontSize={12}>
            by{" "}
            {templateData?.created_by?.first_name && templateData?.created_by?.last_name ? (
              <>
                {templateData.created_by.first_name.charAt(0).toUpperCase() +
                  templateData.created_by.first_name.slice(1)}{" "}
                {templateData.created_by.last_name.charAt(0).toUpperCase() + templateData.created_by.last_name.slice(1)}
              </>
            ) : (
              <>
                {templateData.created_by.username.charAt(0).toUpperCase() + templateData.created_by.username.slice(1)}
              </>
            )}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
