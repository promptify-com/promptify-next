import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccordionBox from "@/components/common/AccordionBox";
import { ExecutionContent } from "../common/ExecutionContent";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import type { Prompts } from "@/core/api/dto/prompts";
import type { PromptExecutions, TemplatesExecutions } from "@/core/api/dto/templates";

interface Props {
  execution: TemplatesExecutions | null;
  promptsData: Prompts[];
}

export default function ExecutionExample({ execution, promptsData }: Props) {
  const [processedExecutions, setProcessedExecutions] = useState<PromptExecutions[]>([]);

  useEffect(() => {
    const processExecutions = async () => {
      if (execution?.prompt_executions) {
        const processed = await Promise.all(
          execution.prompt_executions.map(async exec => ({
            ...exec,
            output: await markdownToHTML(exec.output),
          })),
        );
        setProcessedExecutions(processed);
      }
    };

    processExecutions();
  }, [execution]);

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
            {processedExecutions?.map(exec => {
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
                    <ExecutionContent content={sanitizeHTML(exec.output)} />
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
