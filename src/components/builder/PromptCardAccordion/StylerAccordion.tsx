import DramaMasks from "@/assets/icons/DramaMasks";
import { Prompts } from "@/core/api/dto/prompts";
import { theme } from "@/theme";
import { AddCircle, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import React, { useState } from "react";
import { Styler } from "../Styler/Styler";
import { IEditPrompts } from "@/common/types/builder";
import { useParameters } from "@/hooks/api/parameters";
import { IParameters } from "@/common/types";

interface Props {
  prompt: IEditPrompts;
  setPrompt: (prompt: IEditPrompts) => void;
}

export const StylerAccordion = ({ prompt, setPrompt }: Props) => {
  const [parameters] = useParameters();
  const [showParams, setShowParams] = useState(false);
  const [paramsAnchor, setParamsAnchor] = useState<HTMLElement | null>(null);

  const closeParamsModal = () => {
    setParamsAnchor(null);
    setShowParams(false);
  };

  const addParameter = (param: IParameters) => {
    setPrompt({
      ...prompt,
      parameters: [
        ...prompt.parameters,
        {
          parameter_id: param.id,
          score: 1,
          name: param.name,
          is_visible: true,
          is_editable: true,
          descriptions: param.score_descriptions,
        },
      ],
    });
  };

  return (
    <>
      <Accordion
        key={prompt.id}
        sx={{
          m: "0 24px !important",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "24px !important",
          bgcolor: "surface.1",
          boxShadow: "none",
          ":before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            minHeight: "42px !important",
            ".MuiAccordionSummary-content": {
              m: 0,
              alignItems: "center",
              gap: 2,
            },
          }}
        >
          <DramaMasks
            size="20"
            color={theme.palette.action.active}
          />
          <Stack
            direction={"row"}
            alignItems={"center"}
            flexWrap={"wrap"}
            gap={0.5}
          >
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 500,
                color: "onSurface",
                opacity: 0.8,
              }}
            >
              Style options:
            </Typography>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={0.5}
              sx={{
                whiteSpace: "nowrap",
                maxWidth: "500px",
                overflow: "hidden",
              }}
            >
              {prompt.parameters.slice(0, 2).map(param => {
                const description = param.descriptions
                  ?.find(desc => desc.score === param.score)
                  ?.description?.split(":")[0]
                  .trim();
                return (
                  <Chip
                    key={param.parameter_id}
                    label={param.name + ": " + description}
                    sx={{
                      height: "fit-content",
                      ".MuiChip-label": {
                        p: "2px 6px",
                        fontSize: 13,
                        fontWeight: 400,
                      },
                    }}
                  />
                );
              })}
            </Stack>
            <IconButton
              onClick={e => {
                e.stopPropagation();
                setParamsAnchor(e.currentTarget);
                setShowParams(true);
              }}
              sx={{
                border: "none",
                fontSize: 13,
                fontWeight: 500,
                borderRadius: "999px",
                gap: 1,
                p: "3px 8px",
                "&:hover": {
                  bgcolor: "surface.2",
                },
              }}
            >
              <AddCircle sx={{ width: 18, height: 18, color: alpha(theme.palette.text.secondary, 0.45) }} />
              Add
            </IconButton>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Styler
            selectedNodeData={prompt}
            setSelectedNodeData={setPrompt}
            version="v2"
          />
        </AccordionDetails>
      </Accordion>
      <Popover
        open={showParams}
        anchorEl={paramsAnchor}
        onClose={closeParamsModal}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          height: "480px",
          maxHeight: "60svh",
          maxWidth: "60svw",
          ".MuiPaper-root": {
            height: "100%",
          },
        }}
      >
        <Stack
          height={"100%"}
          width={"100%"}
        >
          <Box p={"16px"}>Add style option:</Box>
          <Divider sx={{ borderColor: "surface.3" }} />
          <Box
            sx={{
              overflowY: "auto",
            }}
          >
            <Box>
              {parameters.map(param => (
                <Button
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    gap: 1,
                    p: "10px 16px",
                    fontSize: 16,
                    fontWeight: 400,
                    borderRadius: 0,
                    ":hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                  onClick={() => {
                    addParameter(param);
                    closeParamsModal();
                  }}
                >
                  {param.name}
                </Button>
              ))}
            </Box>
          </Box>
        </Stack>
      </Popover>
    </>
  );
};
