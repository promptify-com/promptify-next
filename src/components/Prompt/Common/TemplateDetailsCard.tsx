import { useState } from "react";
import { useRouter } from "next/router";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { theme } from "@/theme";
import { useDispatch } from "react-redux";
import { setSelectedTag } from "@/core/store/filtersSlice";
import Image from "@/components/design-system/Image";
import { stripTags } from "@/common/helpers";
import type { Tag } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";

interface DetailsCardProps {
  title: string;
  description: string;
  tags?: Tag[];
  categoryName: string;
  thumbnail: string;
}

const DescriptionTags = ({ description, tags }: { description: string; tags?: Tag[] }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <>
      <Typography
        fontSize={{ xs: 12, md: 14 }}
        fontWeight={400}
        color={"onSurface"}
      >
        {stripTags(description || "")}
      </Typography>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        gap={1}
      >
        {typeof tags !== "undefined" &&
          tags?.length > 0 &&
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

export default function TemplateDetailsCard({ title, description, tags, categoryName, thumbnail }: DetailsCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { isMobile } = useBrowser();

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        borderRadius: isMobile ? "42px" : "48px",
        p: isMobile ? "14px" : 0,
        position: "relative",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={isMobile ? "center" : "flex-start"}
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
              {categoryName}
            </Typography>
            <Typography
              fontSize={{ xs: 20, md: 36 }}
              fontWeight={{ xs: 500, md: 400 }}
              color={"text.primary"}
            >
              {title}
            </Typography>
          </Stack>
          {!isMobile && (
            <DescriptionTags
              tags={tags}
              description={description}
            />
          )}
        </Stack>
        <Image
          src={thumbnail}
          width={isMobile ? 101 : 351}
          height={isMobile ? 72 : 262}
          alt={title}
          priority
          style={{ borderRadius: "48px", objectFit: "cover" }}
          loading="eager"
        />
      </Stack>
      {isMobile && (
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
                tags={tags}
                description={description}
              />
            </Stack>
          </Collapse>
        </>
      )}
    </Box>
  );
}
