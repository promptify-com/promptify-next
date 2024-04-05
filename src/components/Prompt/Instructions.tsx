import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "@/theme";
import AccordionBox from "@/components/common/AccordionBox";
import { Prompts } from "@/core/api/dto/prompts";

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
                  <Typography
                    fontSize={{ xs: 14, md: 16 }}
                    fontWeight={400}
                    color={"secondary.main"}
                  >
                    {prompt.engine.name}
                  </Typography>
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
                    lineHeight={"180%"}
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
