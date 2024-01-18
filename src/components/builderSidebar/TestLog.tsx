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
  const templateId = useAppSelector(state => state.builder.templateId);
  const { data: executions, isLoading: isLoading } = useGetPromptExecutionsQuery(templateId!);

  const [activeExecution, setActiveExecution] = useState<number | null>(null);

  const selectExecution = (execution: number) => {
    if (execution === activeExecution) setActiveExecution(null);
    else setActiveExecution(execution);
  };

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
          executions?.map(execution => (
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
                    src={
                      "https://promptify.s3.amazonaws.com/images_3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZKVPNOTH4PWHN3VM%2F20240117%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20240117T094504Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=0b71c43c09df20f6a7f1eb7db735b98730b32fc1dde5f57f8fc512abeb402107"
                    }
                    alt={"engine"}
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
                      {"Prompt #1"}
                    </Typography>
                    <Typography
                      fontSize={12}
                      fontWeight={400}
                      color={alpha(theme.palette.text.secondary, 0.45)}
                      letterSpacing={".5px"}
                    >
                      GPT-4, {timeAgo(execution.created_at)}, {execution.tokens_spent}s
                    </Typography>
                  </Stack>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ p: "16px 0" }}>
                <ExecutionOutput
                  output={execution.output}
                  engineType={"TEXT"}
                />
              </AccordionDetails>
            </Accordion>
          ))
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
