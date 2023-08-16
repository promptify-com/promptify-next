import React from "react";
import {
  Avatar,
  Box,
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
import { useRouter } from "next/router";
import DraftSpark from "@/assets/icons/DraftSpark";

type CardTemplateLastProps = {
  template: Templates | TemplateExecutionsDisplay;
};

const CardTemplateLast: React.FC<CardTemplateLastProps> = ({ template }) => {
  const router = useRouter();

  return (
    <Box>
      <Card
        sx={{
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
          component="img"
          image={template.thumbnail}
          alt={template.title}
        />

        <Box
          display={"flex"}
          bottom={8}
          mt={-3}
          bgcolor={"surface.1"}
          flexDirection={"column"}
          sx={{
            zIndex: 2,
          }}
        >
          <Grid
            bgcolor={"surface.2"}
            padding={"16px"}
            borderRadius={"16px 16px 0px 0px"}
            display={"flex"}
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
                {template.title}
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
                {template.description?.length > 70
                  ? `${template.description?.slice(0, 70 - 1)}...`
                  : template.description}
              </Typography>
            </Grid>
            <Grid
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
              <Avatar
                src={template.created_by.avatar}
                alt={template.created_by.first_name}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "surface.5",
                }}
              />
            </Grid>
          </Grid>
          <Grid
            padding={"0px 16px"}
            display={"flex"}
            alignItems={"center"}
            height={"48px"}
          >
            <DraftSpark />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "16.8px",
                letterSpacing: "0.15px",
                color: "text.secondary",
              }}
            >
              2246: Redemption
            </Typography>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default CardTemplateLast;
