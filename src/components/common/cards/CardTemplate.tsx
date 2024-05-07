import { useRouter } from "next/router";
import Link from "next/link";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import Favorite from "@mui/icons-material/Favorite";
import Bolt from "@mui/icons-material/Bolt";
import { theme } from "@/theme";
import { setSelectedTag } from "@/core/store/filtersSlice";
import useTruncate from "@/hooks/useTruncate";
import { isDesktopViewPort, stripTags } from "@/common/helpers";
import { useAppDispatch } from "@/hooks/useStore";
import Image from "@/components/design-system/Image";
import type { Templates } from "@/core/api/dto/templates";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type CardTemplateProps = {
  template: Templates;
};

function CardTemplate({ template }: CardTemplateProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { truncate } = useTruncate();
  const isDesktop = isDesktopViewPort();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useIntersectionObserver(containerRef, {});

  const imgPriority = observer?.isIntersecting;

  return (
    <Link
      href={`/prompt/${template.slug}`}
      style={{
        flex: isDesktop ? 1 : "none",
        width: isDesktop ? "auto" : "100%",
        textDecoration: "none",
        position: "relative",
      }}
    >
      <Card
        ref={containerRef}
        sx={{
          minWidth: { xs: "50%", sm: isDesktop ? "210px" : "auto" },
          height: isDesktop ? "calc(100% - 24px)" : "calc(100% - 16px)",
          borderRadius: "16px",
          cursor: "pointer",
          p: isDesktop ? "16px 16px 8px" : "0 0 8px 0",
          bgcolor: "transparent",
          ".tags": {
            display: "none",
          },
          "&:hover": {
            bgcolor: "surface.2",
            borderRadius: "16px 16px 0 0",
            ".tags": {
              display: "flex",
            },
          },
        }}
        elevation={0}
      >
        <Stack
          direction={"column"}
          alignItems={"flex-start"}
          justifyContent={"space-between"}
          gap={{ xs: 0, md: 1 }}
          height={"100%"}
        >
          <Stack
            direction={"column"}
            justifyContent={{ xs: "flex-start", md: "space-between" }}
            alignItems={"flex-start"}
            gap={{ xs: "10px", md: 2 }}
            width={"100%"}
            height={"100%"}
          >
            <CardMedia
              sx={{
                zIndex: 1,
                borderRadius: "16px",
                overflow: "hidden",
                width: "100%",
                height: { xs: "135px", md: "160px" },
              }}
            >
              <Image
                src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
                alt={template.title}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                sizes="(max-width: 600px) 40vw, (max-width: 900px) 35vw, 30vw"
                priority={imgPriority}
              />
            </CardMedia>
            <Stack
              flex={1}
              gap={0.5}
            >
              <Typography
                fontSize={14}
                fontWeight={500}
              >
                {template.title}
              </Typography>
              {isDesktop && (
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: "16.8px",
                    letterSpacing: "0.15px",
                    color: "onSurface",
                    opacity: 0.75,
                  }}
                >
                  {truncate(stripTags(template.description), { length: 70 })}
                </Typography>
              )}
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
              width={{ xs: "auto", md: "100%" }}
              mt={{ xs: "-10px", md: 0 }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={0.5}
                sx={iconTextStyle}
              >
                <Favorite />
                {template.favorites_count || 0}
              </Stack>
              {isDesktop && (
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={0.5}
                  sx={iconTextStyle}
                >
                  <Bolt />
                  {template.likes || template.executions_count || 0}
                </Stack>
              )}
              {template.created_by?.username && (
                <Typography
                  fontSize={13}
                  fontWeight={400}
                  color={alpha(theme.palette.onSurface, 0.75)}
                  sx={{
                    ml: "auto",
                    ":hover": {
                      color: "onSurface",
                    },
                  }}
                  onClick={e => {
                    e.preventDefault();
                    router.push(`/users/${template.created_by?.username}`);
                  }}
                >
                  by {template.created_by.first_name || template.created_by.username}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              p: "8px",
              bgcolor: "surface.2",
              borderRadius: "0 0 16px 16px",
              alignItems: "flex-start",
              alignContent: "flex-start",
              flexDirection: "row",
              gap: "8px var(--1, 8px)",
              flexWrap: "wrap",
              transition: "background-color 0.3s ease",
            }}
            className="tags"
          >
            {template.tags.map(tag => (
              <Chip
                onClick={e => {
                  e.preventDefault();
                  dispatch(setSelectedTag(tag));
                  router.push("/explore");
                }}
                size="small"
                label={tag.name}
                key={tag.id}
                sx={{
                  fontSize: { xs: 11, md: 13 },
                  fontWeight: 400,
                  bgcolor: "white",
                  color: "onSurface",
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}

const iconTextStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "onSurface",
  svg: {
    fontSize: 14,
  },
};

export default CardTemplate;
