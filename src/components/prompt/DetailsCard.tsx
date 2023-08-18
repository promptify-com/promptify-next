import { Templates } from "@/core/api/dto/templates";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";

interface Props {
  templateData: Templates;
}

export const DetailsCard: React.FC<Props> = ({ templateData }) => {
  const { palette } = useTheme();

  return (
    <Stack
      gap={2}
      direction={"column"}
      sx={{
        bgcolor: "surface.1",
        p: { xs: "0px", md: "16px" },
        width: `calc(100% - ${{ xs: 0, md: 32 }}px)`,
        height: "fit-content",
      }}
    >
      <Box
        component={"img"}
        src={templateData.thumbnail || "http://placehold.it/240x150"}
        alt={templateData.title}
        sx={{
          height: 226,
          width: "100%",
          objectFit: "cover",
          borderRadius: { xs: "0px", md: "16px" },
        }}
      />
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flex={1}
        gap={1}
        sx={{
          borderTopLeftRadius: "25px",
          borderTopRightRadius: "25px",
          mt: { xs: "-35px", md: "0px" },
          bgcolor: "#FFF",
        }}
      >
        <Box
          pt={{ xs: "15px", md: "0px" }}
          paddingX={{ xs: "16px", md: "0px" }}
        >
          <Typography
            fontSize={18}
            fontWeight={500}
            color={"onSurface"}
            dangerouslySetInnerHTML={{ __html: templateData.title }}
          />
          <Typography
            fontSize={12}
            fontWeight={500}
            color={"grey.600"}
            dangerouslySetInnerHTML={{ __html: templateData.category.name }}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
