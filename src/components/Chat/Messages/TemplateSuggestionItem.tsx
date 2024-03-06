import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";
import ElectricBolt from "@mui/icons-material/ElectricBolt";

import Image from "../../design-system/Image";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
  onClick: () => void;
}

function TemplateSuggestionItem({ template, onClick }: Props) {
  const { thumbnail, title, description, favorites_count, executions_count } = template;
  return (
    <Stack
      bgcolor={"surface.1"}
      p={"16px 0px"}
      pl={"16px"}
      borderRadius={"24px"}
      direction={"row"}
      gap={"24px"}
      alignItems={"center"}
    >
      <Box
        sx={{
          zIndex: 0,
          position: "relative",
          width: "152px",
          height: "113px",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <Image
          src={thumbnail}
          alt={"Image 1"}
          priority={true}
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <Stack
        width={"55%"}
        direction={"column"}
        justifyItems={"flex-start"}
        gap={2}
      >
        <Box>
          <Typography
            fontSize={18}
            fontWeight={500}
            lineHeight={"25.2px"}
          >
            {title}
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={400}
            lineHeight={"22.2px"}
            sx={{
              opacity: 0.75,
            }}
          >
            {description}
          </Typography>
        </Box>
        <Stack
          direction={"row"}
          gap={"8px"}
          alignItems={"center"}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
          >
            <Favorite
              sx={{
                fontSize: "14px",
                mr: "2px",
              }}
            />
            <Typography
              fontSize={13}
              fontWeight={400}
              lineHeight={"18.2px"}
            >
              {favorites_count}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
          >
            <ElectricBolt
              sx={{
                fontSize: "14px",
                mr: "2px",
              }}
            />

            <Typography
              fontSize={13}
              fontWeight={400}
              lineHeight={"18.2px"}
            >
              {executions_count}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      <Button
        variant="text"
        startIcon={<PlayArrow />}
        sx={{
          color: "onSurface",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        onClick={onClick}
      >
        Run prompt
      </Button>
    </Stack>
  );
}

export default TemplateSuggestionItem;
