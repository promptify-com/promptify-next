import { FC } from "react";
import { Delete, Edit, PreviewRounded, SettingsApplicationsRounded } from "@mui/icons-material";
import { Box, Card, CardMedia, Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";

import { Templates } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import { UserType } from "./TemplatesManager";

interface TemplateManagerItemProps {
  type: UserType;
  template: Templates;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
}

const TemplateManagerItem: FC<TemplateManagerItemProps> = ({ template, type, onOpenEdit, onOpenDelete }) => {
  return (
    <Card
      key={template.id}
      elevation={0}
      sx={{
        p: "10px",
        borderRadius: "16px",
        bgcolor: { xs: "surface.2", md: "surface.1" },
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
            }}
          >
            <Image
              src={template.thumbnail}
              alt={template.title}
              style={{ borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%" }}
            />
          </CardMedia>
          <Box>
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
          <Tooltip title="Preview">
            <IconButton
              sx={{
                bgcolor: "surface.2",
                border: "none",
                color: "onSurface",
                "&:hover": {
                  bgcolor: "surface.3",
                  color: "onSurface",
                },
              }}
              onClick={() => {
                window.open(window.location.origin + `/prompt/${template.slug}`, "_blank");
              }}
            >
              <PreviewRounded />
            </IconButton>
          </Tooltip>
          {type === "admin" && (
            <Tooltip title="Builder">
              <IconButton
                sx={{
                  bgcolor: "surface.2",
                  border: "none",
                  color: "onSurface",
                  "&:hover": {
                    bgcolor: "surface.3",
                    color: "onSurface",
                  },
                }}
                onClick={() => {
                  window.open(window.location.origin + `/builder/${template.id}`, "_blank");
                }}
              >
                <SettingsApplicationsRounded />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Edit">
            <IconButton
              sx={{
                bgcolor: "surface.2",
                border: "none",
                color: "onSurface",
                "&:hover": {
                  bgcolor: "surface.3",
                  color: "onSurface",
                },
              }}
              onClick={onOpenEdit}
            >
              <Edit />
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
};

export default TemplateManagerItem;
