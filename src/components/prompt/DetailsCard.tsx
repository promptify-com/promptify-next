import { Templates } from "@/core/api/dto/templates";
import { Avatar, Box, Stack, Typography, useTheme, CardMedia, useMediaQuery } from "@mui/material";
import React from "react";
import FavoriteIcon from "./FavoriteIcon";
import Image from "@/components/design-system/Image";

interface Props {
  templateData: Templates;
}

const favoriteIconStyle = {
  sx: {
    gap: "3px",
    color: "onSurface",
  },
};

export const DetailsCard: React.FC<Props> = ({ templateData }) => {
  const { breakpoints } = useTheme();

  // Determine the appropriate border radius value based on the breakpoint
  // If the current breakpoint is medium (md) or larger,
  const isMdBreakpoint = useMediaQuery(breakpoints.up("md"));
  const borderRadiusValue = isMdBreakpoint ? "16px" : "0px";

  return (
    <Box
      sx={{
        bgcolor: "surface.1",
        p: { xs: "0px", md: "16px" },
        width: `calc(100% - ${{ xs: 0, md: 32 }}px)`,
        height: "fit-content",
      }}
    >
      <CardMedia
        sx={{
          position: "relative",
          height: 226,
          width: "100%",
          borderRadius: { xs: "0px", md: "16px" },
        }}
      >
        <Image
          src={templateData.thumbnail || "http://placehold.it/240x150"}
          alt={templateData.title}
          style={{ borderRadius: borderRadiusValue, objectFit: "cover", width: "100%", height: "100%" }}
        />
      </CardMedia>
      <Stack
        gap={2}
        sx={{
          borderTopLeftRadius: "25px",
          borderTopRightRadius: "25px",
          position: "relative",
          mt: { xs: "-35px", md: "0px" },
          bgcolor: "surface.1",
          p: { xs: "16px", md: "16px 0 0" },
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          gap={1}
        >
          <Stack gap={1}>
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
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <FavoriteIcon style={favoriteIconStyle} />
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
