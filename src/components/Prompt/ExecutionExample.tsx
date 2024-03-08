import Stack from "@mui/material/Stack";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "@/theme";
import AccordionBox from "@/components/common/AccordionBox";
import { Prompts } from "@/core/api/dto/prompts";

interface Props {
  execution: TemplatesExecutions | null;
  promptsData: Prompts[];
}

export default function ExecutionExample({ execution, promptsData }: Props) {
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
        Example response:
      </Typography>
      {execution ? (
        <AccordionBox>
          <Stack gap={3}>
            {execution?.prompt_executions?.map(exec => {
              const prompt = promptsData.find(_prompt => _prompt.id === exec.prompt) as Prompts;
              return (
                <Stack
                  key={exec.id}
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
                      {exec.output}
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </AccordionBox>
      ) : (
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"onSurface"}
        >
          No example found
        </Typography>
      )}
    </Stack>
  );
}
