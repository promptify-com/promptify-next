import type { Templates } from "@/core/api/dto/templates";
import { alpha, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "./FavoriteIcon";
import Image from "../design-system/Image";
import { theme } from "@/theme";

interface Props {
  templateData: Templates;
}

const favoriteIconStyle = {
  sx: {
    color: "primary.main",
    flexDirection: "column",
  },
};

export function DetailsCardMini({ templateData }: Props) {
  const { palette } = useTheme();

  const templateStatus = templateData?.status !== "PUBLISHED" && (
    <Chip
      label={templateData?.status}
      size="small"
      sx={{ fontSize: "12px", fontWeight: 500, ml: "8px" }}
      component={"span"}
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        p: "8px",
        bgcolor: alpha(palette.surface[1], 0.8),
      }}
    >
      <Stack
        gap={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          bgcolor: alpha(palette.surface[4], 0.6),
          p: "8px",
          height: "fit-content",
          borderRadius: "16px",
        }}
      >
        <Box
          sx={{
            height: 54,
            width: 72,
            objectFit: "cover",
            borderRadius: "16px",
          }}
        >
          <Image
            src={templateData.thumbnail || "http://placehold.it/240x150"}
            alt={templateData.title}
            style={{
              backgroundColor: theme.palette.surface[5],
              width: "100%",
              height: "100%",
              borderRadius: "16px",
              objectFit: "cover",
            }}
          />
        </Box>
        <Box>
          <Typography
            fontSize={14}
            fontWeight={500}
            color={"onSurface"}
          >
            {templateData.title}
            {templateStatus}
          </Typography>
        </Box>
        <FavoriteIcon style={favoriteIconStyle} />
        <Image
          src={templateData.created_by.avatar}
          alt={templateData.created_by.first_name}
          width={40}
          height={40}
          style={{
            backgroundColor: theme.palette.surface[5],
            borderRadius: "50%",
          }}
        />
      </Stack>
    </Box>
  );
}
