import React from "react";
import { Box, Card, Stack, Typography, alpha } from "@mui/material";
import { Preset, PresetType } from "@/common/types/builder";
import { Options } from "@/components/common/Options";
import { theme } from "@/theme";

interface Props {
  highlightValue: string;
  suggestionList: Preset[];
  position: { x: number; y: number } | null;
  optionType: PresetType;
  onSelect: (option: Preset, type: PresetType) => void;
  previousPreset: Preset;
}

export const SuggestionsListDetailed = ({
  highlightValue,
  suggestionList,
  position,
  optionType,
  onSelect,
  previousPreset,
}: Props) => {
  const autocompleteInput = () => {
    let suggestion = <span className="high-input">{highlightValue}</span>;

    if (highlightValue === "{{") {
      suggestion = (
        <>
          <span className="high-input">{"{{"}</span>
          {"InputName:type}}"}
        </>
      );
    } else if (highlightValue.startsWith("{{") && !highlightValue.includes(":")) {
      suggestion = (
        <>
          <span className="high-input">{`{{${highlightValue.slice(2)}`}</span>
          {":type}}"}
        </>
      );
    }

    return suggestion;
  };

  const previousPromptPreset: Preset = {
    label: previousPreset?.label,
  };

  return (
    <>
      {suggestionList.length > 0 && position && (
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
                {autocompleteInput()}
              </Typography>
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
            </Stack>
          )}
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
              onSelect={option => onSelect(option, optionType)}
            />
          </Box>
          {optionType === "input" && previousPromptPreset.label && (
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
                options={[previousPromptPreset]}
                onSelect={option => onSelect(option, "output")}
              />
            </Box>
          )}
        </Card>
      )}
    </>
  );
};
