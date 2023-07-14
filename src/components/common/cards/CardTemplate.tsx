import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { WishHeart } from "@/assets/icons/WishHeart";
import { Templates } from "@/core/api/dto/templates";

type CardTemplateProps = {
  template: Templates;
  onFavoriteClick?: () => void;
  lengthTemplate?: number;
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
        p: { sm: "6px" },
        width: "100%",
        "&:hover": {
          bgcolor: "white",
        },
        "&.MuiCard-root": {
          bgcolor: "white",
        },
      }}
      elevation={0}
    >
      <Grid
        display={"flex"}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "start", md: "center" }}
        justifyContent={"space-between"}
      >
        <Grid
          display={"flex"}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "start", sm: "center" }}
        >
          <CardMedia
            sx={{
              zIndex: 1,
              borderRadius: "16px",
              width: { xs: "100%", sm: "100px" },
              height: { xs: "270px", sm: "70px" },
              objectFit: "cover",
            }}
            component="img"
            image={template.thumbnail}
            alt={template.title}
          />
          <Grid
            sx={{
              ml: { md: "20px" },
            }}
            display={"flex"}
            direction={"column"}
          >
            <Typography fontSize={14} fontWeight={500}>
              {template.title}
            </Typography>
            <Typography fontSize={12} color="text.secondary" variant="body2">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    template.description?.length > 70
                      ? `${template.description?.slice(0, 70 - 1)}...`
                      : template.description,
                }}
              />
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
            {template.tags.slice(0, 3).map((el, idx) => (
              <Chip clickable size="small" label={el.name} key={idx} />
            ))}
          </Grid>
          <Button variant="text" size="small">
            <Grid
              sx={{
                display: "flex",
                gap: "0.4em",
              }}
            >
              <Grid>
                <WishHeart />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  fontSize: "0.7em",
                  alignItems: "center",
                  color: "#8c8b8e",
                }}
              >
                {template.likes}
              </Grid>
            </Grid>
          </Button>
          <Avatar
            src={template.title}
            alt={template.title}
            sx={{ bgcolor: "indigo" }}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default CardTemplate;
