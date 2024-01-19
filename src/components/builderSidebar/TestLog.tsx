import { useGetPromptExecutionsQuery } from "@/core/api/templates";
import { useAppSelector } from "@/hooks/useStore";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { alpha } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import Image from "@/components/design-system/Image";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { theme } from "@/theme";
import ExecutionOutput from "@/components/builder/ExecutionOutput";
import { CardExecutionPlaceholder } from "@/components/placeholders/CardExecutionPlaceholder";

const TestLog = () => {
  const template = useAppSelector(state => state.builder.template);
  const { data: executions, isLoading: isLoading } = useGetPromptExecutionsQuery(template?.id!);

  const [activeExecution, setActiveExecution] = useState<number | null>(null);

  const selectExecution = (execution: number) => {
    if (execution === activeExecution) setActiveExecution(null);
    else setActiveExecution(execution);
  };

  const defaultEngineIcon =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS58O0-OcWTqwlFJCYTkJUSVlGeqleLPstyYdxFFcXNpQ&s";

  return (
    <Box
      sx={{
        height: "calc(100% - 70px)",
        overflow: "auto",
        overscrollBehavior: "contain",
      }}
    >
      <Box p={"16px"}>
        {isLoading ? (
          Array.from({ length: 5 }, (_, i) => <CardExecutionPlaceholder key={i} />)
        ) : executions && executions.length > 0 ? (
          executions?.map(execution => {
            const engine = execution.prompt.engine;
            const engineType = execution.prompt.engine.output_type ?? "TEXT";
            return (
              <Accordion
                key={execution.id}
                expanded={activeExecution === execution.id}
                onChange={() => setActiveExecution(execution.id)}
                onClick={() => selectExecution(execution.id)}
                sx={{
                  p: "16px",
                  boxShadow: "none",
                  borderRadius: "8px",
                  bgcolor: "transparent",
                  "::before": { display: "none" },
                  ":hover": { bgcolor: alpha(theme.palette.surface[2], 0.7) },
                  "&.Mui-expanded": { bgcolor: "surface.2" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore fontSize="small" />}
                  sx={{ p: 0, minHeight: "unset !important", ".MuiAccordionSummary-content": { m: 0 } }}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <Image
                      src={engine.icon || defaultEngineIcon}
                      alt={engine.name}
                      width={25}
                      height={25}
                      style={{ borderRadius: "50%" }}
                    />
                    <Stack>
                      <Typography
                        fontSize={14}
                        fontWeight={500}
                        color={"onSurface"}
                      >
                        {execution.prompt.title}
                      </Typography>
                      <Typography
                        fontSize={12}
                        fontWeight={400}
                        color={alpha(theme.palette.text.secondary, 0.45)}
                        letterSpacing={".5px"}
                      >
                        {engine.name}, {timeAgo(execution.created_at)}, {execution.tokens_spent}s
                      </Typography>
                    </Stack>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ p: "16px 0" }}>
                  <ExecutionOutput
                    output={execution.output}
                    engineType={engineType}
                  />
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Typography
            sx={{
              mt: "20svh",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 400,
              color: "onSurface",
            }}
          >
            No test found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TestLog;
