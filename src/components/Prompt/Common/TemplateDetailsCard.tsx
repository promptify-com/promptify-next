import React, { useState } from "react";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Tag, Templates } from "@/core/api/dto/templates";
import { theme } from "@/theme";
import { useDispatch } from "react-redux";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useRouter } from "next/router";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Image from "@/components/design-system/Image";

interface TemplateDetailsCardProps {
  template: Templates;
  min?: boolean;
}

const DescriptionTags = ({ description, tags }: { description: string; tags: Tag[] }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <>
      <Typography
        fontSize={{ xs: 12, md: 14 }}
        fontWeight={400}
        color={"onSurface"}
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
};

export default function TemplateDetailsCard({ template, min }: TemplateDetailsCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        borderRadius: min ? "42px" : "48px",
        p: min ? "14px" : 0,
        position: "relative",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={min ? "center" : "flex-start"}
        gap={1}
      >
        <Stack
          gap={2}
          sx={{
            p: { md: "48px 72px 48px 54px" },
          }}
        >
          <Stack
            gap={1}
            sx={{ wordBreak: "break-word", hyphens: "auto" }}
          >
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
          {!min && (
            <DescriptionTags
              tags={template.tags}
              description={template.description}
            />
          )}
        </Stack>
        <Image
          src={template.thumbnail}
          width={min ? 101 : 351}
          height={min ? 72 : 262}
          alt={template.title}
          priority
          style={{ borderRadius: "48px", objectFit: "cover" }}
          loading="eager"
        />
      </Stack>
      {min && (
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
            <Stack
              gap={1}
              my={"8px"}
            >
              <DescriptionTags
                tags={template.tags}
                description={template.description}
              />
            </Stack>
          </Collapse>
        </>
      )}
    </Box>
  );
}
