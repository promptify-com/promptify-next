import React, { useState } from "react";
import { Box, CardMedia, Chip, Collapse, IconButton, Stack, Typography, alpha } from "@mui/material";
import { Tag, Templates } from "@/core/api/dto/templates";
import { theme } from "@/theme";
import { useDispatch } from "react-redux";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useRouter } from "next/router";
import { isDesktopViewPort, redirectToPath } from "@/common/helpers";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface TemplateDetailsCardProps {
  template: Templates;
  min?: boolean;
  variant?: "default" | "light";
  redirect?: boolean;
}

const DescriptionTags = ({
  tags,
  description,
  variant,
  redirect,
}: { tags: Tag[]; description: string } & Pick<TemplateDetailsCardProps, "redirect" | "variant">) => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <>
      <Typography
        fontSize={{ xs: 12, md: variant === "light" ? 12 : 14 }}
        fontWeight={400}
        color={"onSurface"}
        sx={{
          opacity: variant === "light" ? 0.75 : 1,
        }}
      >
        {description}
      </Typography>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        gap={1}
      >
        {tags?.length > 0 &&
          tags.map(tag => (
            <Chip
              key={tag.id}
              onClick={() => {
                if (!redirect) {
                  dispatch(setSelectedTag(tag));
                  router.push("/explore");
                }
              }}
              variant={"filled"}
              label={tag.name}
              sx={{
                fontSize: 13,
                fontWeight: 400,
                bgcolor: variant === "light" ? "surface.4" : "surface.1",
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
};

export const TemplateDetailsCard: React.FC<TemplateDetailsCardProps> = ({
  template,
  min = false,
  variant = "default",
  redirect,
}) => {
  const isDesktopView = isDesktopViewPort();
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      onClick={() => {
        if (redirect) redirectToPath(`/prompt/${template.slug}`, {}, true);
      }}
      sx={{
        bgcolor: variant === "light" ? "#FFF" : alpha(theme.palette.primary.main, 0.08),
        borderRadius: { xs: "42px", md: "48px" },
        p: { xs: "14px", md: 0 },
        position: "relative",
        ...(redirect && {
          cursor: "pointer",
          ":hover": {
            bgcolor: "surface.1",
          },
        }),
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={{ xs: "center", md: "flex-start" }}
        flexWrap={{ xs: "wrap", md: "nowrap" }}
      >
        <Stack
          flex={1}
          gap={2}
          sx={{
            p: { md: "40px 24px 40px 16px" },
            ...(variant === "light" && { pl: { md: "36px" } }),
          }}
        >
          <Stack gap={1}>
            {variant === "default" && (
              <Typography
                fontSize={{ xs: 12, md: 14 }}
                fontWeight={500}
                color={alpha(theme.palette.text.secondary, 0.45)}
              >
                {template.category.name}
              </Typography>
            )}
            <Typography
              fontSize={{ xs: 20, md: variant === "light" ? 20 : 36 }}
              fontWeight={{ xs: 500, md: variant === "light" ? 500 : 400 }}
              color={"text.primary"}
            >
              {template.title}
            </Typography>
          </Stack>
          {isDesktopView && (
            <DescriptionTags
              redirect={redirect}
              description={template.description}
              variant={variant}
              tags={template.tags}
            />
          )}
        </Stack>
        <Stack pb={{ md: variant === "light" ? 0 : "24px" }}>
          <CardMedia
            sx={{
              width: { xs: "101px", md: "351px" },
              height: { xs: "72px", md: "222px" },
              objectFit: "cover",
              borderRadius: { xs: "48px", md: "48px" },
            }}
            component="img"
            image={template.thumbnail}
            alt={template.title}
          />
        </Stack>
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
              <DescriptionTags
                redirect={redirect}
                description={template.description}
                variant={variant}
                tags={template.tags}
              />
            </Stack>
          </Collapse>
        </>
      )}
    </Box>
  );
};
