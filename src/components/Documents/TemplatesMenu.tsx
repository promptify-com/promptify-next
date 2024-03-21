import React from "react";
import { CardMedia, ListItemButton, Typography, Chip, Grid, List, Divider, Box } from "@mui/material";
import useTruncate from "@/hooks/useTruncate";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import Image from "../design-system/Image";
import { useRouter } from "next/router";

interface TemplatesMenuSectionProps {
  templates: TemplateExecutionsDisplay[];
  onClose?: () => void;
}

const TemplatesMenuSection: React.FC<TemplatesMenuSectionProps> = ({ templates, onClose }) => {
  const router = useRouter();
  const { truncate } = useTruncate();

  return (
    <List
      sx={{
        pt: 0,
        width: { xs: "100%", md: "401px" },
      }}
    >
      <Grid padding={"8px 16px 16px 16px"}>
        <Typography
          textTransform={"uppercase"}
          fontSize={"12px"}
          lineHeight={"180%"}
          letterSpacing={"1px"}
          color={"#375CA9"}
        >
          Templates
        </Typography>
      </Grid>
      <Divider />
      <Box
        sx={{
          height: "408px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 1 0 2px rgba(0, 0, 0, 0.6)",
            webkitBoxShadow: "inset 1 1 6px rgba(0,0,0,0.50)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "surface.5",
            outline: "1px solid surface.5",
            borderRadius: "10px",
          },
        }}
      >
        {templates.map(template => (
          <ListItemButton
            sx={{ p: 0 }}
            key={template.id}
            onClick={() => {
              router.push(`prompt/${template.slug}`);
              onClose?.();
            }}
          >
            <Grid
              padding={"16px"}
              display={"flex"}
              flexDirection={"column"}
              gap={"8px"}
            >
              <Grid
                display={"flex"}
                alignItems={"center"}
                gap={"8px"}
              >
                <CardMedia
                  sx={{
                    zIndex: 1,
                    borderRadius: "8px",
                    width: "41px",
                    height: "31px",
                    objectFit: "cover",
                  }}
                >
                  <Image
                    src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
                    alt={template.title}
                    width={41}
                    height={31}
                    style={{ borderRadius: "8px", objectFit: "cover", zIndex: 1 }}
                  />
                </CardMedia>
                <Typography
                  fontSize={"13px"}
                  lineHeight={"140%"}
                  letterSpacing={"0.15px"}
                >
                  {template.title}
                </Typography>
              </Grid>
              <Typography
                fontSize={"12px"}
                fontWeight={400}
                lineHeight={"140%"}
                letterSpacing={"0.15px"}
                sx={{
                  opacity: 0.75,
                }}
              >
                {truncate(template.description, { length: 53 })}
              </Typography>
              <Grid
                display={"flex"}
                gap={"8px"}
                flexWrap={"wrap"}
              >
                {template.tags.slice(0, 3).map(tag => (
                  <Chip
                    size="small"
                    key={tag.id}
                    label={tag.name}
                    sx={{
                      bgcolor: "surface.5",
                    }}
                  />
                ))}
              </Grid>
            </Grid>
          </ListItemButton>
        ))}
      </Box>
    </List>
  );
};

export default TemplatesMenuSection;
