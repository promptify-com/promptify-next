import DramaMasks from "@/assets/icons/DramaMasks";
import { theme } from "@/theme";
import AddCircle from "@mui/icons-material/AddCircle";
import ExpandMore from "@mui/icons-material/ExpandMore";
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
import { IParameters } from "@/common/types";
import { useGetParametersQuery } from "@/core/api/parameters";
import { BUILDER_TYPE } from "@/common/constants";
import { addParameter } from "@/common/helpers/addParameter";

interface Props {
  prompt: IEditPrompts;
  setPrompt: (prompt: IEditPrompts) => void;
}

export const StylerAccordion = ({ prompt, setPrompt }: Props) => {
  const { data: parameters } = useGetParametersQuery();
  const [showParams, setShowParams] = useState(false);
  const [paramsAnchor, setParamsAnchor] = useState<HTMLElement | null>(null);

  const closeParamsModal = () => {
    setParamsAnchor(null);
    setShowParams(false);
  };

  const createParameter = (param: IParameters) => {
    const updatedPrompt = addParameter({
      prompt,
      newParameter: param,
    });
    setPrompt(updatedPrompt);
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
            minHeight: "auto !important",
            py: "8px",
            ".MuiAccordionSummary-content": {
              m: 0,
              alignItems: "center",
              gap: 2,
              width: "100%",
            },
            ".Mui-expanded": {
              m: 0,
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
            flexWrap={"nowrap"}
            gap={0.5}
            width={"100%"}
          >
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 500,
                color: "onSurface",
                opacity: 0.8,
                whiteSpace: "nowrap",
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
                textOverflow: "ellipsis",
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
            type={BUILDER_TYPE.USER}
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
              {parameters?.map(param => (
                <Button
                  key={param.id}
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
                  disabled={prompt.parameters.some(prompt => prompt.parameter_id === param.id)}
                  onClick={() => {
                    createParameter(param);
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
