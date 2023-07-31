import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";
import { Favorite } from "@mui/icons-material";
import Link from "next/link";

type CardTemplateProps = {
  template: Templates | TemplateExecutionsDisplay;
};

const CardTemplate: React.FC<CardTemplateProps> = ({ template }) => {
  return (
    <Link
      href={{ pathname: `/prompt/${template.slug}` }}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          borderRadius: "16px",
          cursor: "pointer",
          p: "8px",
          bgcolor: { xs: "surface.2", md: "white" },
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
            <Grid display={"flex"} alignItems={"center"} gap={"16px"}>
              <Grid>
                <CardMedia
                  sx={{
                    zIndex: 1,
                    borderRadius: "16px",
                    width: { xs: "98px", sm: "72px" },
                    height: { xs: "73px", sm: "54px" },
                    objectFit: "cover",
                  }}
                  component="img"
                  image={template.thumbnail}
                  alt={template.title}
                />
              </Grid>
              <Grid gap={0.5} sx={{}} display={"flex"} flexDirection={"column"}>
                <Typography fontSize={14} fontWeight={500}>
                  {template.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: "16.8px",
                    letterSpacing: "0.15px",
                    color: "onSurface",
                  }}
                >
                  {template.description?.length > 70
                    ? `${template.description?.slice(0, 70 - 1)}...`
                    : template.description}
                </Typography>
              </Grid>
            </Grid>
            <Avatar
              src={template.created_by.avatar}
              alt={template.created_by.first_name}
              sx={{
                display: { xs: "flex", md: "none" },
                width: 32,
                height: 32,
                bgcolor: "surface.5",
              }}
            />
          </Grid>
          <Grid
            display={"flex"}
            alignItems={{ xs: "end", md: "center" }}
            width={{ xs: "100%", md: "auto" }}
            justifyContent={"space-between"}
            gap={1}
          >
            <Grid
              sx={{
                display: "flex",
                gap: "4px",
              }}
            >
              {template.tags.slice(0, 3).map((el) => (
                <Chip
                  key={el.id}
                  clickable
                  size="small"
                  label={el.name}
                  sx={{
                    fontSize: { xs: 11, md: 13 },
                    fontWeight: 400,
                    color: "onSurface",
                  }}
                />
              ))}
            </Grid>
            <Button variant="text" size="small">
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
                  <Favorite sx={{ fontSize: 18 }} />
                  {template.likes}
                </Stack>
              </Grid>
            </Button>
            <Avatar
              src={template.created_by.avatar}
              alt={template.created_by.first_name}
              sx={{
                display: { xs: "none", md: "flex" },
                width: 32,
                height: 32,
                bgcolor: "surface.5",
              }}
            />
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};

export default CardTemplate;
