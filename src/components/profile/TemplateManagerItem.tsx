import { FC } from "react";
import { Delete, SettingsApplicationsRounded } from "@mui/icons-material";
import { Box, Card, CardMedia, Chip, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import { useRouter } from "next/router";
import { useAppSelector } from "@/hooks/useStore";
import { RootState } from "@/core/store";
import { getBaseUrl } from "@/common/helpers";

interface TemplateManagerItemProps {
  template: Templates;
  onOpenDelete: () => void;
}

const TemplateManagerItem: FC<TemplateManagerItemProps> = ({ template, onOpenDelete }) => {
  const router = useRouter();
  const currentUser = useAppSelector((state: RootState) => state.user.currentUser);

  const navigateToTemplate = () => router.push(`/prompt/${template.slug}`);

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
              cursor: "pointer",
            }}
            onClick={navigateToTemplate}
          >
            <Image
              src={template.thumbnail}
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
};

export default TemplateManagerItem;
