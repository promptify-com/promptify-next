import React from "react";
import { Box, CardMedia, Chip, Stack, Typography } from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
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
        pl={"40px"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        sx={{
          flexWrap: { xs: "wrap", md: "nowrap" },
          bgcolor: "surface.2",
          borderRadius: "16px",
        }}
      >
        <Stack
          flex={1}
          gap={2}
          sx={{
            p: "40px 24px 40px 16px",
          }}
        >
          <Typography
            fontSize={36}
            fontWeight={400}
            color={"text.primary"}
          >
            {template.title}
          </Typography>
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
                    bgcolor: "surface.4",
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

        <Stack pb={"24px"}>
          <CardMedia
            sx={{
              width: "351px",
              height: "222px",
              objectFit: "cover",
              borderRadius: "16px",
            }}
            component="img"
            image={template.thumbnail}
            alt={template.title}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
