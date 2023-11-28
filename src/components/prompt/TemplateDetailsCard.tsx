import React, { useState } from "react";
import { Box, CardMedia, Chip, Collapse, IconButton, Stack, Typography, alpha } from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
import { theme } from "@/theme";
import { useDispatch } from "react-redux";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useRouter } from "next/router";
import { isDesktopViewPort } from "@/common/helpers";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface TemplateDetailsCardProps {
  template: Templates;
  min?: boolean;
}

export const TemplateDetailsCard: React.FC<TemplateDetailsCardProps> = ({ template, min = false }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDesktopView = isDesktopViewPort();
  const [expanded, setExpanded] = useState(false);

  const DescriptionTags = () => (
    <>
      <Typography
        fontSize={{ xs: 12, md: 14 }}
        fontWeight={400}
        color={"onSurface"}
      >
        {template.description}
      </Typography>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        gap={1}
      >
        {template.tags?.length > 0 &&
          template.tags.map(tag => (
            <Chip
              key={tag.id}
              onClick={() => {
                dispatch(setSelectedTag(tag));
                router.push("/explore");
              }}
              variant={"filled"}
              label={tag.name}
              sx={{
                fontSize: 13,
                fontWeight: 400,
                bgcolor: "surface.1",
                color: "onSurface",
                p: "3px 0",
                height: "auto",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            />
          ))}
      </Stack>
    </>
  );

  return (
    <Box
      sx={{
        width: { xs: "calc(100% - 32px)", md: "calc(100% - 80px)" },
        m: { xs: "16px", md: "0 40px" },
        bgcolor: "surface.5",
        borderRadius: { xs: "42px", md: "48px" },
        p: { xs: "14px", md: 0 },
        position: "relative",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={{ xs: "center", md: "flex-start" }}
        flexWrap={{ xs: "wrap", md: "nowrap" }}
      >
        <Stack
          gap={2}
          sx={{
            p: { md: "48px 72px 48px 54px" },
          }}
        >
          <Stack gap={1}>
            <Typography
              fontSize={{ xs: 12, md: 14 }}
              fontWeight={500}
              color={alpha(theme.palette.text.secondary, 0.45)}
            >
              {template.category.name}
            </Typography>
            <Typography
              fontSize={{ xs: 20, md: 36 }}
              fontWeight={{ xs: 500, md: 400 }}
              color={"text.primary"}
            >
              {template.title}
            </Typography>
          </Stack>
          {isDesktopView && <DescriptionTags />}
        </Stack>
        <CardMedia
          sx={{
            width: { xs: "101px", md: "351px" },
            height: { xs: "72px", md: "262px" },
            objectFit: "cover",
            borderRadius: "48px",
          }}
          component="img"
          image={template.thumbnail}
          alt={template.title}
        />
      </Stack>
      {!isDesktopView && (
        <>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              m: "auto",
              bottom: 2,
              width: "fit-content",
              border: "none",
              p: "0 10px",
              svg: { color: "onSurface" },
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Collapse in={expanded}>
            <Stack gap={2}>
              <DescriptionTags />
            </Stack>
          </Collapse>
        </>
      )}
    </Box>
  );
};
