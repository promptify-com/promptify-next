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

const PARAMETERS = [
  { name: "Age", value: 30 },
  { name: "Gender", value: "male" },
  { name: "Purpose", value: "maintain my weight and this is long text item" },
  { name: "Activity level", value: "none" },
  { name: "Equipment", value: "none" },
  { name: "Specific requirement", value: "none" },
];

interface Props {
  document: ExecutionWithTemplate;
}

function Details({ document }: Props) {
  const template = document.template;

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
          alignItems={"center"}
          gap={2}
          sx={{
            p: "8px",
            borderRadius: "24px",
            bgcolor: "surfaceContainerLow",
          }}
        >
          <Image
            src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={template.title}
            style={{ borderRadius: "24px", objectFit: "cover", width: "103px", height: "77px" }}
          />
          <Stack
            flex={1}
            gap={1}
          >
            <Typography
              fontSize={16}
              fontWeight={500}
              color={"onSurface"}
            >
              {template.title}
            </Typography>
            <Typography
              fontSize={16}
              fontWeight={400}
              color={"secondary.light"}
            >
              {template.category.name}
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
          },
          ".MuiAccordionSummary-content": { m: "0 !important" },
          ".MuiAccordionDetails-root": { p: 0 },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>Prompt instruction:</AccordionSummary>
        <AccordionDetails>
          <Stack gap={1}>
            <Box sx={inputsContainer}>
              <Typography sx={instructionTitleStyle}>Motivational Coach</Typography>
              {PARAMETERS.map(param => (
                <Typography
                  key={param.name}
                  fontSize={15}
                  fontWeight={500}
                  color={"secondary.main"}
                  sx={inputStyle}
                >
                  {param.name} <span className="val">{param.value}</span>
                </Typography>
              ))}
            </Box>
            <Box sx={inputsContainer}>
              <Typography sx={instructionTitleStyle}>Contextual parameters</Typography>
              <Typography
                fontSize={15}
                fontWeight={500}
                color={"secondary.main"}
                sx={inputStyle}
              >
                Tone <span className="val">Professional</span>
              </Typography>
            </Box>
            <Button
              LinkComponent={Link}
              href={`/prompt-builder/${template.slug}`}
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
  ".val": { fontWeight: 400 },
  ":not(:last-of-type)": { borderBottom: `1px solid ${theme.palette.surfaceContainerHigh}` },
};
