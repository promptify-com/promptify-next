import Stack from "@mui/material/Stack";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { theme } from "@/theme";
import Link from "next/link";
import Edit from "@mui/icons-material/Edit";
import { formatDate } from "@/common/helpers/timeManipulation";
import { usePrepareExecutionInputs } from "@/components/Documents/Hooks/usePrepareExecutionInputs";

interface Props {
  document: ExecutionWithTemplate;
}

function Details({ document }: Props) {
  const template = document.template;
  const { inputs, params } = usePrepareExecutionInputs(document);

  return (
    <Stack
      gap={3}
      py={"48px"}
    >
      <Stack gap={2}>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"secondary.light"}
        >
          Prompt used:
        </Typography>
        <Stack
          direction={"row"}
          gap={2}
          sx={{
            p: "8px",
            borderRadius: "24px",
            bgcolor: "surfaceContainerLow",
          }}
        >
          <Image
            src={template?.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={template?.title || "Promptify"}
            style={{ borderRadius: "16px", objectFit: "cover", width: "103px", height: "77px" }}
          />
          <Stack
            flex={1}
            gap={1}
            justifyContent={"space-between"}
          >
            <Typography
              fontSize={16}
              fontWeight={500}
              color={"onSurface"}
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {template?.title}
            </Typography>
            <Typography
              fontSize={14}
              fontWeight={400}
              color={"secondary.light"}
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {template?.category.name}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Accordion
        defaultExpanded
        sx={{
          boxShadow: "none",
          px: "8px",
          borderRadius: "24px !important",
          bgcolor: "surfaceContainerLow",
          m: "0 !important",
          "::before": { display: "none" },
          ".MuiAccordionSummary-root": {
            p: "16px 8px",
            fontSize: 14,
            fontWeight: 500,
            color: "onSurface",
          },
          ".MuiAccordionSummary-content": { m: "0 !important" },
          ".MuiAccordionDetails-root": { p: 0 },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>Prompt instruction:</AccordionSummary>
        <AccordionDetails>
          <Stack gap={1}>
            <Box sx={inputsContainer}>
              {inputs.length > 0 ? (
                inputs.map(input => (
                  <Typography
                    key={input[0]}
                    fontSize={14}
                    fontWeight={500}
                    color={"secondary.main"}
                    sx={inputStyle}
                  >
                    {input[0]}: <span className="val">{input[1] || "none"}</span>
                  </Typography>
                ))
              ) : (
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  color={"secondary.light"}
                  sx={inputStyle}
                >
                  No instruction specified
                </Typography>
              )}
            </Box>
            {params.length > 0 && (
              <Box sx={inputsContainer}>
                <Typography sx={instructionTitleStyle}>Contextual parameters</Typography>
                {params.map(param => (
                  <Typography
                    key={param[0]}
                    fontSize={14}
                    fontWeight={500}
                    color={"secondary.main"}
                    sx={inputStyle}
                  >
                    {param[0]}: <span className="val">{param[1] || "none"}</span>
                  </Typography>
                ))}
              </Box>
            )}
            <Button
              LinkComponent={Link}
              href={`/prompt-builder/${template?.slug}`}
              target="_blank"
              endIcon={<Edit />}
              variant="contained"
              sx={{
                my: "8px",
                p: "8px 16px",
                fontSize: 14,
                fontWeight: 500,
                svg: {
                  fonSize: 24,
                },
              }}
            >
              Edit
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Typography
        fontSize={14}
        fontWeight={400}
        color={"onSurface"}
        sx={{
          py: "16px",
          ".label": {
            opacity: 0.5,
            mr: "8px",
          },
        }}
      >
        <span className="label">Created at:</span> {formatDate(document.created_at)}
      </Typography>
    </Stack>
  );
}

export default Details;

const instructionTitleStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "onSurface",
  p: "16px 16px 8px",
};
const inputsContainer = {
  bgcolor: "surfaceContainerLowest",
  borderRadius: "24px",
};
const inputStyle = {
  p: "12px 16px",
  wordBreak: "break-all",
  maxHeight: "120px",
  overflow: "auto",
  "::-webkit-scrollbar": {
    display: "none",
  },
  ".val": { fontWeight: 400 },
  ":not(:last-of-type)": { borderBottom: `1px solid ${theme.palette.surfaceContainerHigh}` },
};
