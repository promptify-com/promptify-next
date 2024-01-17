import { useGetTemplatePromptExecutionsQuery } from "@/core/api/templates";
import { useAppSelector } from "@/hooks/useStore";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, alpha } from "@mui/material";
import React, { useState } from "react";
import Image from "../design-system/Image";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { borderRadius } from "polished";
import { theme } from "@/theme";

const TestLog = () => {
  const templateId = useAppSelector(state => state.builder.templateId);
  const { data: executions, isLoading: isLoading } = useGetTemplatePromptExecutionsQuery(templateId!);

  const [activeExecution, setActiveExecution] = useState<number | null>(null);

  return (
    <Box
      sx={{
        height: "calc(100% - 70px)",
        overflow: "auto",
        overscrollBehavior: "contain",
      }}
    >
      <Box p={"16px"}>
        {executions?.map(execution => (
          <Accordion
            key={execution.id}
            expanded={activeExecution === execution.id}
            onChange={() => setActiveExecution(execution.id)}
            sx={{
              p: "16px",
              boxShadow: "none",
              "::before": { display: "none" },
              ":hover": { bgcolor: alpha(theme.palette.surface[2], 0.4) },
              "&.Mui-expanded": { bgcolor: "surface.2", borderRadius: "8px" },
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
            <AccordionDetails>{execution.output}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default TestLog;
