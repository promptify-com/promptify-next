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

type CardTemplateProps = {
  template: Templates | TemplateExecutionsDisplay;
  onFavoriteClick?: () => void;
};

const CardTemplate: React.FC<CardTemplateProps> = ({
  template,
  onFavoriteClick,
}) => {
  return (
    <Card
      onClick={onFavoriteClick}
      sx={{
        borderRadius: "16px",
        cursor: "pointer",
        p: { sm: "8px" },
        width: "100%",
        bgcolor: "surface.1",
        "&:hover": {
          bgcolor: "action.hover",
        }
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
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "start", sm: "center" }}
        >
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "16px",
              width: { xs: "100%", sm: "72px" },
              height: { xs: "270px", sm: "54px" },
              objectFit: "cover",
            }}
            component="img"
            image={template.thumbnail}
            alt={template.title}
          />
          <Grid gap={.5}
            sx={{
              ml: { md: "20px" },
            }}
            display={"flex"}
            flexDirection={"column"}
          >
            <Typography fontSize={14} fontWeight={500}>
              {template.title}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "16.8px",
                letterSpacing: "0.15px",
                color: "onSurface"
              }}
            >
              {template.description?.length > 70
                ? `${template.description?.slice(0, 70 - 1)}...`
                : template.description
              }
            </Typography>
          </Grid>
        </Grid>
        <Grid display={"flex"} alignItems={"center"} gap={1}>
          <Grid
            sx={{
              display: "flex",
              gap: "4px",
            }}
          >
            {template.tags.slice(0, 3).map((el) => (
              <Chip key={el.id} clickable size="small" label={el.name}
                sx={{ fontSize: 13, fontWeight: 400, color: "onSurface" }}
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
              <Stack direction={"row"} alignItems={"center"} gap={.5}
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
              width: 32,
              height: 32,
              bgcolor: "surface.5"
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default CardTemplate;
