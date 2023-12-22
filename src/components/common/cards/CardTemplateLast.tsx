import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import PlayCircle from "@mui/icons-material/PlayCircle";
import type { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import useTruncate from "@/hooks/useTruncate";
import SavedSpark from "@/assets/icons/SavedSpark";
import NoSpark from "@/assets/icons/NoSpark";
import Image from "@/components/design-system/Image";
import { redirectToPath } from "@/common/helpers";
import { theme } from "@/theme";

type CardTemplateLastProps = {
  template: TemplateExecutionsDisplay;
};

function CardTemplateLast({ template }: CardTemplateLastProps) {
  const { truncate } = useTruncate();

  return (
    <Box>
      <Card
        onClick={() => {
          redirectToPath(`prompt/${template.slug}`, { hash: template.executions[0].hash });
        }}
        sx={{
          cursor: "pointer",
          maxWidth: "266px",
          width: "266px",
          minHeight: "277px",
          bgcolor: "transparent",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
        }}
        elevation={0}
      >
        <CardMedia
          sx={{
            zIndex: 0,
            borderRadius: "16px 16px 0px 0px",
            width: "100%",
            height: "115px",
            objectFit: "cover",
          }}
        >
          <Image
            src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={template.title}
            style={{ borderRadius: "16px 16px 0px 0px", objectFit: "cover", width: "100%", height: "100%" }}
          />
        </CardMedia>

        <Box
          display={"flex"}
          mt={-1.5}
          bgcolor={{ xs: "surface.2", md: "surface.1" }}
          flexDirection={"column"}
          sx={{
            zIndex: 2,
          }}
        >
          <Grid
            bgcolor={{ xs: "surface.3", md: "surface.2" }}
            padding={"16px"}
            borderRadius={"16px 16px 0px 0px"}
            display={"flex"}
            height={"121px"}
            position={"relative"}
            flexDirection={"column"}
            gap={"17px"}
          >
            <Grid>
              <Typography
                fontSize={14}
                fontWeight={500}
                lineHeight={"140%"}
                letterSpacing={"0.15px"}
              >
                {truncate(template.title, {
                  length: 32,
                })}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: "16.8px",
                  letterSpacing: "0.15px",
                  color: "text.secondary",
                }}
              >
                {truncate(template.description, { length: 60 })}
              </Typography>
            </Grid>
            <Grid
              position={"absolute"}
              bottom={6}
              right={"16px"}
              left={"16px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={0.5}
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "onSurface",
                  pl: 0.5,
                  width: "10px",
                }}
              >
                <Favorite sx={{ fontSize: 18 }} />
                {template.favorites_count || 0}
              </Box>
              <Image
                src={template.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                alt={template.created_by?.first_name ?? "Promptify"}
                width={32}
                height={32}
                style={{
                  backgroundColor: theme.palette.surface[5],
                  borderRadius: "50%",
                }}
              />
            </Grid>
          </Grid>
          {!!template.executions && template.executions.length > 0 ? (
            <Grid
              padding={"0px 16px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              height={"48px"}
            >
              <Box
                display={"flex"}
                alignItems={"bottom"}
                gap={"8px"}
              >
                <SavedSpark />
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: "18.59px",
                    letterSpacing: "0.17px",
                    color: "onSurface",
                  }}
                  title={template.executions[0].title}
                >
                  {truncate(template.executions[0].title, { length: 38 })}
                </Typography>
              </Box>

              <IconButton
                onClick={() => {
                  redirectToPath(`prompt/${template.slug}`, { hash: template.executions[0].id });
                }}
                sx={{
                  border: "none",
                  "&:hover": {
                    bgcolor: "surface.2",
                  },
                }}
              >
                <PlayCircle />
              </IconButton>
            </Grid>
          ) : (
            <Grid
              padding={"0px 16px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              height={"48px"}
            >
              <Box
                display={"flex"}
                alignItems={"bottom"}
                gap={"8px"}
              >
                <NoSpark />
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: "18.59px",
                    letterSpacing: "0.17px",
                    color: "onSurface",
                    opacity: 0.25,
                  }}
                >
                  No Spark Found
                </Typography>
              </Box>
            </Grid>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export default CardTemplateLast;
