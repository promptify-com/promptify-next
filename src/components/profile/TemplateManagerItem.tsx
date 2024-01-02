import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { FC } from "react";
import Delete from "@mui/icons-material/Delete";
import SettingsApplicationsRounded from "@mui/icons-material/SettingsApplicationsRounded";

import Image from "@/components/design-system/Image";
import { getBaseUrl, redirectToPath } from "@/common/helpers";
import type { Templates } from "@/core/api/dto/templates";

interface TemplateManagerItemProps {
  template: Templates;
  onOpenDelete: () => void;
}

function TemplateManagerItem({ template, onOpenDelete }: TemplateManagerItemProps) {
  const navigateToTemplate = () => {
    redirectToPath(`/prompt/${template.slug}`);
  };

  return (
    <Card
      key={template.id}
      elevation={0}
      sx={{
        p: "10px",
        borderRadius: "16px",
        bgcolor: "surface.2",
      }}
    >
      <Grid
        container
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Grid
          item
          xs={12}
          md={7}
          display={"flex"}
          alignItems={"center"}
          gap={"16px"}
        >
          <CardMedia
            sx={{
              height: { xs: "90px", md: "60px" },
              width: "80px",
              borderRadius: "16px",
              cursor: "pointer",
            }}
            onClick={navigateToTemplate}
          >
            <Image
              src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
              alt={template.title}
              style={{ borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%" }}
            />
          </CardMedia>
          <Box
            sx={{
              cursor: "pointer",
              ":hover": {
                opacity: 0.8,
              },
            }}
            onClick={navigateToTemplate}
          >
            <Typography>{template.title}</Typography>
          </Box>
          <Chip
            label={template.status}
            size="small"
            sx={{ fontSize: "12px", fontWeight: 500 }}
          />
        </Grid>
        <Grid
          display={"flex"}
          alignItems={"center"}
          ml={"auto"}
          gap={"8px"}
        >
          <Box mr={3}>
            <Tooltip
              placement="top"
              arrow
              title={`Created by ${template.created_by.first_name || template.created_by.username}`}
            >
              <Avatar
                src={template.created_by.avatar}
                sx={{ width: 30, height: 30 }}
              />
            </Tooltip>
          </Box>
          <Tooltip title="Builder">
            <IconButton
              sx={{
                display: { xs: "none", md: "inline-flex" },
                bgcolor: "surface.2",
                border: "none",
                color: "onSurface",
                "&:hover": {
                  bgcolor: "surface.3",
                  color: "onSurface",
                },
              }}
              onClick={() => {
                window.open(`${getBaseUrl}/prompt-builder/${template.slug}`, "_blank");
              }}
            >
              <SettingsApplicationsRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={onOpenDelete}
              sx={{
                bgcolor: "surface.2",
                border: "none",
                color: "onSurface",
                "&:hover": {
                  bgcolor: "surface.3",
                  color: "#ef4444",
                },
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Card>
  );
}

export default TemplateManagerItem;
