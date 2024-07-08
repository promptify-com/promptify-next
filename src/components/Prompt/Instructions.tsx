import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "@/theme";
import AccordionBox from "@/components/common/AccordionBox";
import { Prompts } from "@/core/api/dto/prompts";
import Image from "../design-system/Image";

interface Props {
  prompts: Prompts[];
}

export default function Instructions({ prompts }: Props) {
  return (
    <Stack
      gap={3}
      p={{ xs: "10px 24px", md: "48px" }}
    >
      <Typography
        fontSize={{ xs: 24, md: 32 }}
        fontWeight={400}
        color={"onSurface"}
        py={"16px"}
      >
        Prompt instructions:
      </Typography>
      {prompts.length > 0 ? (
        <AccordionBox footerText={prompts.length > 1 ? `Chain of ${prompts.length - 1} more prompts...` : undefined}>
          <Stack gap={3}>
            {prompts.map(prompt => (
              <Stack
                key={prompt.id}
                gap={2}
              >
                <Stack
                  direction={"row"}
                  gap={1}
                >
                  <Typography
                    fontSize={{ xs: 14, md: 16 }}
                    fontWeight={500}
                    color={"onSurface"}
                  >
                    {prompt.title}
                  </Typography>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={"8px"}
                  >
                    <Box
                      width={"16px"}
                      height={"16px"}
                      borderRadius={"16px"}
                      overflow={"hidden"}
                      position={"relative"}
                    >
                      <Image
                        fill
                        style={{ objectFit: "cover" }}
                        alt={prompt.engine.name}
                        src={prompt.engine.icon}
                      />
                    </Box>
                    <Typography
                      fontSize={{ xs: 14, md: 16 }}
                      fontWeight={400}
                      color={"secondary.main"}
                    >
                      {prompt.engine.name}
                    </Typography>
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    ml: "8px",
                    p: "16px 16px 16px 32px",
                    borderLeft: `1px solid ${theme.palette.secondary.light}`,
                  }}
                >
                  <Typography
                    fontSize={{ xs: 14, md: 16 }}
                    fontWeight={400}
                    color={"onSurface"}
                    fontFamily={"Roboto, Mono"}
                    whiteSpace={"pre-wrap"}
                  >
                    {prompt.content}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </AccordionBox>
      ) : (
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"onSurface"}
        >
          No instructions found
        </Typography>
      )}
    </Stack>
  );
}
