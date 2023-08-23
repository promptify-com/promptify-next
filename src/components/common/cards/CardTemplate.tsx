import React from "react";
import { Avatar, Box, Card, CardMedia, Chip, Grid, Stack, Typography } from "@mui/material";
import { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setSelectedTag } from "@/core/store/filtersSlice";

import Image from "@/components/design-system/Image";

type CardTemplateProps = {
  template: Templates | TemplateExecutionsDisplay;
  noRedirect?: boolean;
};

const CardTemplate: React.FC<CardTemplateProps> = ({ template, noRedirect = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Box
      onClick={() => {
        if (!noRedirect) {
          router.push(`/prompt/${template.slug}`);
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
                    borderRadius: "16px",
                    width: { xs: "98px", sm: "72px" },
                    height: { xs: "73px", sm: "54px" },
                  }}
                >
                  <Image src={template.thumbnail} alt={template.title} style={{borderRadius: "16%", objectFit: "cover", width: "100%", height: "100%"}}/>
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
            marginTop={{ xs: "10px", md: "0px" }}
            justifyContent={"space-between"}
            gap={3}
          >
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
    </Box>
  );
};

export default CardTemplate;
