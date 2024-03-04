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
      p={"48px"}
    >
      <Typography
        fontSize={32}
        fontWeight={400}
        color={"onSurface"}
        py={"16px"}
      >
        Prompt instructions:
      </Typography>
      <AccordionBox>
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
                  fontSize={16}
                  fontWeight={500}
                  color={"onSurface"}
                >
                  {prompt.title}
                </Typography>
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"secondary.main"}
                >
                  {prompt.engine.name}
                </Typography>
              </Stack>
              <Box
                sx={{
                  px: "8px",
                }}
              >
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                  sx={{
                    p: "16px 16px 16px 32px",
                    borderLeft: `1px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  {prompt.content}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </AccordionBox>
    </Stack>
  );
}
