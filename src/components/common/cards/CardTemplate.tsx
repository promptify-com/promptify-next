import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
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
import { isDesktopViewPort, redirectToPath } from "@/common/helpers";
import { theme } from "@/theme";
import { useAppDispatch } from "@/hooks/useStore";
import { FavoriteBorder } from "@mui/icons-material";

type CardTemplateProps = {
  template: Templates | TemplateExecutionsDisplay;
  noRedirect?: boolean;
  query?: string;
  asResult?: boolean;
  min?: boolean;
};

function CardTemplate({ template, noRedirect = false, query, asResult = false, min }: CardTemplateProps) {
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

  const TemplateTags = (
    <Grid
      sx={{
        display: "flex",
        gap: "4px",
      }}
    >
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
    </Grid>
  );

  return (
    <Box
      onClick={() => {
        if (!noRedirect) {
          redirectToPath(`/prompt/${template.slug}`);
        }
      }}
    >
      <Card
        sx={{
          borderRadius: "16px",
          cursor: "pointer",
          p: "8px",
          bgcolor: "surface.2",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        elevation={0}
      >
        <Grid
          display={"flex"}
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ xs: "start", md: "center" }}
          justifyContent={"space-between"}
        >
          <Grid
            display={"flex"}
            flexDirection={"row"}
            width={{ xs: "100%", md: "auto" }}
            justifyContent={"space-between"}
            gap={{ xs: "16px", md: 0 }}
            alignItems={"center"}
          >
            <Grid
              display={"flex"}
              alignItems={"center"}
              gap={"16px"}
            >
              <Grid>
                <CardMedia
                  sx={{
                    zIndex: 1,
                    borderRadius: min ? "18px" : "10px",
                    overflow: "hidden",
                    width: min ? "64px" : { xs: "98px", md: "72px" },
                    height: min ? "48px" : { xs: "73px", md: "54px" },
                  }}
                >
                  <Image
                    src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
                    alt={template.title}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </CardMedia>
              </Grid>
              <Grid
                gap={0.5}
                sx={{}}
                display={"flex"}
                flexDirection={"column"}
              >
                <Typography
                  fontSize={14}
                  fontWeight={500}
                >
                  {highlightSearchQuery(template.title)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: "16.8px",
                    letterSpacing: "0.15px",
                    color: "onSurface",
                    opacity: min ? 0.45 : 1,
                  }}
                >
                  {min
                    ? template.tags.map(tag => tag.name).join(", ")
                    : highlightSearchQuery(truncate(template.description, { length: 70 }))}
                </Typography>
              </Grid>
            </Grid>

            {!isDesktop && !min && (
              <Image
                src={template.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                alt={template.created_by?.first_name?.slice(0, 1) ?? "P"}
                width={32}
                height={32}
                style={{
                  display: asResult ? "none" : "flex",
                  backgroundColor: theme.palette.surface[5],
                  borderRadius: "50%",
                }}
              />
            )}
          </Grid>
          <Grid
            display={asResult ? "none" : "flex"}
            alignItems={{ xs: "end", md: "center" }}
            width={{ xs: "100%", md: "auto" }}
            marginTop={{ xs: "10px", md: "0px" }}
            justifyContent={"space-between"}
            gap={3}
          >
            {!min && TemplateTags}
            <Grid
              sx={{
                display: "flex",
                gap: "0.4em",
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                sx={{
                  display: "flex",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "onSurface",
                }}
              >
                {min ? <FavoriteBorder sx={{ fontSize: 18 }} /> : <ArrowBackIosRoundedIcon sx={{ fontSize: 14 }} />}
                {template.favorites_count || 0}
              </Stack>
            </Grid>
            {isDesktop && !min && (
              <Image
                src={template.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                alt={template.created_by?.first_name?.slice(0, 1) ?? "P"}
                width={32}
                height={32}
                style={{
                  backgroundColor: theme.palette.surface[5],
                  borderRadius: "50%",
                }}
              />
            )}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

export default CardTemplate;
