import Stack from "@mui/material/Stack";

import type { Templates } from "@/core/api/dto/templates";
import { Box, Button, Typography } from "@mui/material";
import Image from "../design-system/Image";
import { Favorite, PlayArrow } from "@mui/icons-material";

interface Props {
  templates: Templates[];
}

function TemplateSuggestions({ templates }: Props) {
  return (
    <Stack
      bgcolor={"surfaceContainerLow"}
      p={"8px"}
      borderRadius={"24px"}
    >
      <Stack
        direction={"column"}
        gap={"8px"}
      >
        {templates.map(template => (
          <Stack
            key={template.id}
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
                src={template.thumbnail}
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
                  {template.title}
                </Typography>
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  lineHeight={"22.2px"}
                  sx={{
                    opacity: 0.75,
                  }}
                >
                  {template.description}
                </Typography>
              </Box>
              <Box
                display={"flex"}
                alignItems={"center"}
              >
                <Favorite
                  sx={{
                    fontSize: "14px",
                    mr: "4px",
                  }}
                />{" "}
                <Typography
                  fontSize={13}
                  fontWeight={400}
                  lineHeight={"18.2px"}
                >
                  {template.favorites_count}
                </Typography>
              </Box>
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
            >
              Run prompt
            </Button>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default TemplateSuggestions;
