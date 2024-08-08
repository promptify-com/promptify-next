import Stack from "@mui/material/Stack";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { theme } from "@/theme";
import Edit from "@mui/icons-material/Edit";
import { usePrepareExecutionInputs } from "@/components/Documents/Hooks/usePrepareExecutionInputs";
import useBrowser from "@/hooks/useBrowser";
import { useAppDispatch } from "@/hooks/useStore";
import { useRouter } from "next/router";
import { repeatExecution } from "@/components/Prompt/Utils";
import { updatePopupTemplate } from "@/core/store/templatesSlice";
import { setDocumentTitle, setFavorites } from "@/core/store/documentsSlice";

interface Props {
  document: ExecutionWithTemplate;
}

function InstructionsAccordion({ document }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isMobile } = useBrowser();
  const { inputs, params } = usePrepareExecutionInputs(document);

  const handleRepeatExecution = async () => {
    repeatExecution(document, true, dispatch);
    router.push("/chat");
    dispatch(
      updatePopupTemplate({
        data: null,
      }),
    );
    dispatch(setDocumentTitle(""));
    dispatch(setFavorites({}));
  };

  return (
    <Accordion
      defaultExpanded={!isMobile}
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
      <AccordionSummary expandIcon={<ExpandMore />}>Prompt Inputs:</AccordionSummary>
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
            onClick={handleRepeatExecution}
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
  );
}

export default InstructionsAccordion;

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
