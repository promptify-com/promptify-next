import React from "react";
import { Box, CardMedia, Chip, Stack, Typography, alpha } from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
import { theme } from "@/theme";
import { useDispatch } from "react-redux";
import { setSelectedTag } from "@/core/store/filtersSlice";
import { useRouter } from "next/router";

interface TemplateDetailsCardProps {
  template: Templates;
}
export const TemplateDetailsCard: React.FC<TemplateDetailsCardProps> = ({ template }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Box>
      <Stack
        pb={"20px"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        sx={{
          flexWrap: { xs: "wrap", md: "nowrap" },
          bgcolor: "surface.2",
          borderRadius: "48px",
        }}
      >
        <Stack
          gap={2}
          sx={{
            p: "48px 72px 38px 54px",
          }}
        >
          <Stack gap={1}>
            <Typography
              fontSize={36}
              fontWeight={400}
              color={"text.primary"}
            >
              {template.title}
            </Typography>
          </Stack>
          <Typography
            fontSize={14}
            fontWeight={400}
            color={"onSurface"}
          >
            {template.description}
          </Typography>
          <Stack
            direction={"row"}
            flexWrap={"wrap"}
            gap={1}
          >
            {template.tags?.length > 0 &&
              template.tags.map(tag => (
                <Chip
                  key={tag.id}
                  onClick={() => {
                    dispatch(setSelectedTag(tag));
                    router.push("/explore");
                  }}
                  variant={"filled"}
                  label={tag.name}
                  sx={{
                    fontSize: 13,
                    fontWeight: 400,
                    bgcolor: "surface.3",
                    color: "onSurface",
                    p: "3px 0",
                    height: "auto",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                />
              ))}
          </Stack>
        </Stack>
        <CardMedia
          sx={{
            width: "351px",
            height: "202px",
            objectFit: "cover",
            borderRadius: "48px",
          }}
          component="img"
          image={template.thumbnail}
          alt={template.title}
        />
      </Stack>
    </Box>
  );
};
