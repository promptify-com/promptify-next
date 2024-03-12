import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import type { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";
import { useRouter } from "next/router";
import { setSelectedTag } from "@/core/store/filtersSlice";
import Image from "@/components/design-system/Image";
import useTruncate from "@/hooks/useTruncate";
import { isDesktopViewPort, stripTags } from "@/common/helpers";
import { theme } from "@/theme";
import { useAppDispatch } from "@/hooks/useStore";
import Link from "next/link";
import { alpha } from "@mui/material";
import Favorite from "@mui/icons-material/Favorite";
import { Bolt } from "@mui/icons-material";
import Box from "@mui/material/Box";

type CardTemplateProps = {
  template: Templates | TemplateExecutionsDisplay;
  query?: string;
  asResult?: boolean;
  vertical?: boolean;
  bgColor?: string;
  showTagsOnHover?: boolean;
};

function CardTemplate({
  template,
  query,
  asResult,
  vertical,
  bgColor = "surface.2",
  showTagsOnHover = false,
}: CardTemplateProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { truncate } = useTruncate();
  const isDesktop = isDesktopViewPort();

  const highlightSearchQuery = (text: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, idx) =>
      regex.test(part) ? (
        <span
          key={idx}
          style={{ color: "#375CA9", fontWeight: "bold", textDecoration: "underline" }}
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const conditionalTagStyles = showTagsOnHover && {
    "&:hover .tags": {
      zIndex: 999,
      display: "flex",
    },
  };

  return (
    <Box
      component={Link}
      href={`/prompt/${template.slug}`}
      sx={{
        flex: isDesktop ? 1 : "none",
        textDecoration: "none",
        width: isDesktop ? "auto" : "100%",
        position: "relative",
        maxWidth: {
          xs: "100%",
          sm: "300px",
          md: "300px",
          lg: "254px",
        },
      }}
    >
      <Card
        sx={{
          width: "auto",
          minWidth: isDesktop && vertical ? "210px" : "auto",
          height: isDesktop && vertical ? "calc(100% - 24px)" : "calc(100% - 16px)",
          borderRadius: {
            sm: "16px",
            md: showTagsOnHover ? "16px 16px 0 0" : "16px",
          },
          cursor: "pointer",
          p: isDesktop && vertical ? "16px 16px 8px" : "8px",
          bgcolor: isDesktop && vertical ? "transparent" : bgColor,
          transition: "background-color 0.1s ease",
          "&:hover": {
            bgcolor: bgColor,
          },
          ...conditionalTagStyles,
          display: "flex",
          flexDirection: "column",
        }}
        elevation={0}
      >
        <Stack
          direction={{ xs: "column", md: vertical ? "column" : "row" }}
          alignItems={{ xs: "start", md: vertical ? "flex-start" : "center" }}
          justifyContent={"space-between"}
          gap={1}
          flex={1}
          height={"100%"}
        >
          <Stack
            direction={isDesktop && vertical ? "column" : "row"}
            justifyContent={{ xs: "flex-start", md: "space-between" }}
            alignItems={vertical ? "flex-start" : "center"}
            flexWrap={"wrap"}
            gap={2}
            width={"100%"}
            height={"100%"}
            minHeight={{
              xs: "auto",
              md: "275px",
            }}
          >
            <CardMedia
              sx={{
                zIndex: 1,
                borderRadius: "16px",
                overflow: "hidden",
                width: { xs: "98px", sm: vertical ? "100%" : "72px" },
                height: { xs: "73px", sm: vertical ? "160px" : "54px" },
              }}
            >
              <Image
                src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
                alt={template.title}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </CardMedia>
            <Stack
              flex={1}
              gap={0.5}
            >
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  maxWidth: "200px",

                  color: "var(--onSurface, var(--onSurface, #1A1C18))",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                  fontFamily: "Poppins",
                  fontSize: {
                    xs: "12",
                    md: "16px",
                  },
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                {highlightSearchQuery(template.title)}
              </Typography>
              <Typography
                sx={{
                  color: "var(--onSurface, var(--onSurface, #1A1C18))",
                  fontFeatureSettings: "'clig' off, 'liga' off",
                  fontFamily: "Poppins",
                  fontSize: "13px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "140%",
                  opacity: 0.75,
                }}
              >
                {highlightSearchQuery(truncate(stripTags(template.description), { length: 55 }))}
              </Typography>
            </Stack>
            {!vertical && (
              <Image
                src={template.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                alt={template.created_by?.first_name?.slice(0, 1) ?? "P"}
                width={32}
                height={32}
                style={{
                  display: isDesktop ? "none" : asResult ? "none" : "flex",
                  backgroundColor: theme.palette.surface[5],
                  borderRadius: "50%",
                }}
              />
            )}
            {vertical && (
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                width={"100%"}
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
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={0.5}
                  sx={iconTextStyle}
                >
                  <Bolt />
                  {template.executions_count || 0}
                </Stack>
                <Typography
                  ml={"auto"}
                  fontSize={13}
                  fontWeight={400}
                  color={alpha(theme.palette.onSurface, 0.75)}
                >
                  by {template.created_by.first_name || template.created_by.username}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Stack
            display={asResult ? "none" : "flex"}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={{ xs: "end", md: "center" }}
            width={{ xs: "100%", md: "auto" }}
            marginTop={{ xs: vertical ? 0 : "10px", md: "0px" }}
            gap={2}
          >
            <Stack
              direction={"row"}
              gap={1}
            >
              {!vertical && (
                <>
                  {template.tags.slice(0, 3).map(tag => (
                    <Chip
                      key={tag.id}
                      clickable
                      size="small"
                      label={tag.name}
                      sx={{
                        fontSize: { xs: 11, md: 13 },
                        fontWeight: 400,
                        bgcolor: "surface.5",
                        color: "onSurface",
                      }}
                      onClick={e => {
                        e.stopPropagation();

                        dispatch(setSelectedTag(tag));

                        router.push("/explore");
                      }}
                    />
                  ))}
                  <Grid
                    sx={{
                      display: "flex",
                      gap: "0.4em",
                    }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      gap={0.5}
                      sx={{
                        display: "flex",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "onSurface",
                      }}
                    >
                      <ArrowBackIosRoundedIcon sx={{ fontSize: 14 }} />
                      {template.favorites_count || 0}
                    </Stack>
                  </Grid>
                  <Image
                    src={template.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                    alt={template.created_by?.first_name?.slice(0, 1) ?? "P"}
                    width={32}
                    height={32}
                    style={{
                      display: isDesktop ? "flex" : "none",
                      backgroundColor: theme.palette.surface[5],
                      borderRadius: "50%",
                    }}
                  />
                </>
              )}
            </Stack>
          </Stack>
        </Stack>

        {conditionalTagStyles && (
          <Stack
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 0,
              p: "8px",
              bgcolor: "surface.2",
              borderRadius: "0 0 16px 16px",
              display: "none",
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
        )}
      </Card>
    </Box>
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
