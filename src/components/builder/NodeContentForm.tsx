import React, { useRef, useState } from "react";
import { Box, Card, Divider, Grid, Stack, Typography } from "@mui/material";
import HighlightWithinTextarea, { Selection } from "react-highlight-within-textarea";

import { HighlightWithinTextareaRef, INodesData } from "@/common/types/builder";
import { Options } from "../common/Options";
import { getInputsFromString } from "@/common/helpers";
import { IVariable } from "@/common/types/prompt";
import { useCursorPosition } from "@/hooks/useCursorPosition";

type PresetType = "node" | "input";

interface AddPresetParams {
  type: PresetType;
  label: string;
  firstAppend?: boolean;
}
interface Props {
  selectedNodeData: INodesData;
  setSelectedNodeData: (node: INodesData) => void;
  nodes: INodesData[];
}

export const NodeContentForm: React.FC<Props> = ({ selectedNodeData, setSelectedNodeData, nodes }) => {
  const cursorPositionRef = useRef(0);
  const suggestionListRef = useRef<HTMLDivElement | null>(null);
  const divRef = useRef<HighlightWithinTextareaRef | null>(null);

  const [suggestionList, setSuggestionList] = useState<IVariable[]>([]);

  const isSuggestionsVisible = Boolean(suggestionList.length > 0);

  console.log(isSuggestionsVisible);

  const cursorPosition = useCursorPosition(divRef, isSuggestionsVisible);
  const [optionType, setOptionType] = useState<PresetType>("node");
  const [highlightedOption, setHighlightedOption] = useState("");

  const [lastPosition, setLastPosition] = useState<number>(0);

  const content = selectedNodeData.content || "";

  const highlight = [
    {
      highlight: /{{.*?}}|{{/g, // Highlight {{ or {{ followed by any characters inside
      className: "input-variable",
    },
    {
      highlight: /\$[\w]*|\$/g, // Highlight $ followed by word characters or $
      className: "output-variable",
    },
  ];

  const otherNodes = nodes.filter(
    node =>
      (node.id !== selectedNodeData.id && node.id !== selectedNodeData.temp_id) ||
      (node.temp_id !== selectedNodeData.id && node.temp_id !== selectedNodeData.temp_id),
  );
  const nodesPresets = otherNodes.map(node => ({ id: node.id, label: node.prompt_output_variable || node.title }));
  const inputsPresets = otherNodes
    .map(node => ({ id: node.id, inputs: getInputsFromString(node.content) }))
    .filter(node => node.inputs && node.inputs.length)
    .flatMap(node =>
      node.inputs.map(input => ({
        id: node.id,
        label: input.name,
        type: input.type,
        required: input.required,
        choices: input.choices,
      })),
    );

  const showSuggestions = (value: string) => {
    let suggestionListArr: IVariable[];
    let textAfterRegexValue = "";

    const indexOfDoubleBrace = value.lastIndexOf("{{");
    const indexOfDollarSign = value.lastIndexOf("$");

    if (indexOfDoubleBrace > indexOfDollarSign) {
      suggestionListArr = inputsPresets;
      setOptionType("input");
      textAfterRegexValue = value.substring(indexOfDoubleBrace + 2);
    } else {
      suggestionListArr = nodesPresets;
      setOptionType("node");
      textAfterRegexValue = value.substring(indexOfDollarSign + 1);
    }

    if (textAfterRegexValue !== "") {
      suggestionListArr = suggestionList.filter(suggestion =>
        suggestion.label.toLowerCase().includes(textAfterRegexValue.toLowerCase()),
      );
    }
    let highlightedOptionValue = `${optionType === "input" ? "{{" : "$"}${textAfterRegexValue}`;
    setHighlightedOption(highlightedOptionValue);
    setSuggestionList(suggestionListArr);
  };

  const changeContent = (content: string, selection?: Selection | undefined) => {
    const { focus } = selection ?? {};
    if (focus) {
      setLastPosition(focus + 1);
    }
    cursorPositionRef.current = lastPosition;
    setSelectedNodeData({
      ...selectedNodeData,
      content,
    });
  };

  const addPreset = ({ type, label, firstAppend = false }: AddPresetParams) => {
    if (!label) return;
    let preset = "";

    if (type === "node") {
      const matchedNode = nodesPresets.find(node => node.label === label);
      if (matchedNode) {
        preset = matchedNode.label;
        if (content.endsWith("$")) {
          preset = preset.substring(1);
        }
      }
    } else {
      const input = inputsPresets.find(input => input.label === label);

      if (input) {
        const type = input.type;
        if (content.endsWith("{{")) {
          preset = `${input.label}:${type}:${input.required}${input.choices ? `:"${input.choices}"` : ""}}}`;
        } else {
          preset = `{{${input.label}:${type}:${input.required}${input.choices ? `:"${input.choices}"` : ""}}}`;
        }
      }
    }

    if (highlightedOption !== "" && !firstAppend) {
      preset = preset.substring(highlightedOption.length);
    }

    if (!firstAppend) {
      changeContent(content + preset + " ");
    } else {
      const start = content.slice(0, cursorPositionRef.current);
      const end = content.slice(cursorPositionRef.current);
      changeContent(start + preset + " " + end);
    }

    setLastPosition(val => val + preset.length);
  };

  const handleSuggestionSelect = (option: IVariable) => {
    addPreset({ type: optionType, label: option.label });
    setHighlightedOption("");
    setSuggestionList([]);
  };

  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <Stack
        gap={1}
        sx={{
          p: "24px 32px",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          flexWrap={"wrap"}
          gap={0.5}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "1px",
            }}
          >
            CONNECTED:
          </Typography>
          <Options
            type="node"
            variant="horizontal"
            options={nodesPresets}
            onChoose={node => addPreset({ type: "node", label: node.label, firstAppend: true })}
          />
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          flexWrap={"wrap"}
          gap={0.5}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "1px",
            }}
          >
            INPUTS:
          </Typography>
          <Options
            type="input"
            variant="horizontal"
            options={inputsPresets}
            onChoose={input => addPreset({ type: "input", label: input.label, firstAppend: true })}
          />
        </Stack>
      </Stack>
      <Divider />
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            p: "24px 32px",
            height: "calc(100% - 48px)",
            position: "relative",
            ".public-DraftEditorPlaceholder-root": {
              position: "absolute",
            },
          }}
        >
          <HighlightWithinTextarea
            ref={divRef}
            value={content}
            highlight={highlight}
            placeholder="..."
            stripPastedStyles
            onChange={(newValue, selection) => {
              changeContent(newValue, selection);
              showSuggestions(newValue);
            }}
          />
          {suggestionList.length > 0 && cursorPosition && (
            <Card
              ref={suggestionListRef}
              elevation={2}
              sx={{
                padding: "16px",
                maxWidth: "200px",
                zIndex: 999,
                bgcolor: "surface.1",
                maxHeight: "300px",
                overflow: "auto",
                position: "absolute",
                top: cursorPosition.y + "px",
                left: cursorPosition.x + "px",

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
              <Options
                type={optionType}
                variant="vertical"
                options={suggestionList}
                onChoose={handleSuggestionSelect}
              />
            </Card>
          )}
        </Box>
      </Box>
    </Stack>
  );
};
