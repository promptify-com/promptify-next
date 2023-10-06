import React, { useEffect, useMemo, useState } from "react";
import { Box, Card, Chip, ClickAwayListener, Stack, Typography, alpha } from "@mui/material";
import { Preset, PresetType } from "@/common/types/builder";
import { Options } from "@/components/common/Options";
import { theme } from "@/theme";
import { InputType } from "@/common/types/prompt";

interface Props {
  highlightValue: string;
  suggestionList: Preset[];
  position: { x: number; y: number } | null;
  optionType: PresetType;
  onSelect: (option: Preset, type: PresetType) => void;
  previousPresets: Preset[];
  setType: (type: InputType) => void;
}

export const SuggestionsListDetailed = ({
  highlightValue,
  suggestionList,
  position,
  optionType,
  onSelect,
  previousPresets,
  setType,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [showTypes, setShowTypes] = useState(false);

  useEffect(() => {
    if (optionType === "input") {
      setOpen(highlightValue.includes("{{") && !highlightValue.includes("}}"));
    } else {
      setOpen(highlightValue === "$");
    }
  }, [highlightValue]);

  const handleSelect = (option: Preset, type: PresetType) => {
    onSelect(option, type);
    setOpen(false);
  };

  const autocompleteInput = useMemo(() => {
    let suggestion;
    setShowTypes(false);

    if (highlightValue === "{{") {
      suggestion = (
        <>
          <span className="high-input">{"{{"}</span>
          {"InputName:text}}"}
        </>
      );
    } else if (highlightValue.startsWith("{{") && !highlightValue.includes(":")) {
      suggestion = (
        <>
          <span className="high-input">{`{{${highlightValue.slice(2)}`}</span>
          {":text}}"}
        </>
      );
    } else if (!highlightValue.includes("}}")) {
      suggestion = <span className="high-input">{highlightValue}</span>;
      setShowTypes(true);
    }

    return suggestion;
  }, [highlightValue]);

  const showPreviousOutputs = (optionType === "output" || highlightValue === "{{") && previousPresets.length > 0;
  const types: InputType[] = ["text", "number", "choices", "code"];

  return (
    <>
      {open && position && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Card
            elevation={2}
            sx={{
              width: "300px",
              zIndex: 999,
              bgcolor: "surface.1",
              maxHeight: "300px",
              overflow: "auto",
              overscrollBehavior: "contain",
              position: "absolute",
              top: position.y + "px",
              left: position.x + "px",
              "&::-webkit-scrollbar": {
                width: "4px",
                p: 1,
                backgroundColor: "surface.1",
              },
              "&::-webkit-scrollbar-track": {
                webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "surface.5",
                outline: "1px solid surface.3",
                borderRadius: "10px",
              },
            }}
          >
            {optionType === "input" && (
              <Stack
                gap={1}
                sx={{
                  p: "16px",
                  borderBottom: "1px solid #E1E2EC",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "text.primary",
                  }}
                >
                  Create prompt detail:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 400,
                    color: alpha(theme.palette.text.secondary, 0.45),
                    "& .high-input": {
                      color: "#00897B",
                    },
                  }}
                >
                  {autocompleteInput}
                </Typography>
                {showTypes ? (
                  <>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "text.secondary",
                        opacity: 0.5,
                      }}
                    >
                      Possible variable types:
                    </Typography>
                    <Stack
                      direction={"row"}
                      gap={0.5}
                    >
                      {types.map(type => (
                        <Chip
                          key={type}
                          label={type}
                          sx={{
                            bgcolor: "#E0F2F1",
                            color: "#00897B",
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "default",
                            ":hover": {
                              bgcolor: "#E0F2F1",
                            },
                          }}
                          onClick={() => setType(type)}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </>
                ) : (
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 400,
                      color: "text.secondary",
                      opacity: 0.5,
                    }}
                  >
                    Use simple text for name
                  </Typography>
                )}
              </Stack>
            )}
            {suggestionList.length > 0 && optionType === "input" && (
              <Box
                sx={{
                  p: "16px",
                  borderBottom: "1px solid #E1E2EC",
                }}
              >
                <Typography
                  fontSize={12}
                  fontWeight={400}
                  mb={1}
                >
                  Prompt details asked to the user:
                </Typography>
                <Options
                  type={optionType}
                  variant="horizontal"
                  options={suggestionList}
                  onSelect={option => handleSelect(option, optionType)}
                />
              </Box>
            )}
            {showPreviousOutputs && (
              <Box
                sx={{
                  p: "16px",
                  borderBottom: "1px solid #E1E2EC",
                }}
              >
                <Typography
                  fontSize={12}
                  fontWeight={400}
                  mb={1}
                >
                  Previous prompts output:
                </Typography>
                <Options
                  type={"output"}
                  variant="horizontal"
                  options={previousPresets}
                  onSelect={option => handleSelect(option, "output")}
                />
              </Box>
            )}
          </Card>
        </ClickAwayListener>
      )}
    </>
  );
};
