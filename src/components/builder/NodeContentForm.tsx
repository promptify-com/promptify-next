import React, { useRef, useState } from "react";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import HighlightWithinTextarea, { Selection } from "react-highlight-within-textarea";

import { INodesData } from "@/common/types/builder";
import { Options } from "../common/Options";
import { getInputsFromString } from "@/common/helpers";

type PresetType = "node" | "input";
interface Props {
  selectedNodeData: INodesData;
  setSelectedNodeData: (node: INodesData) => void;
  nodes: INodesData[];
}

export const NodeContentForm: React.FC<Props> = ({ selectedNodeData, setSelectedNodeData, nodes }) => {
  const cursorPositionRef = useRef(0);
  const suggestionListRef = useRef<HTMLDivElement | null>(null);

  const [firstAppend, setFirstAppend] = useState(true);

  const [suggestionList, setSuggestionList] = useState<{ id: number | undefined; label: string }[]>([]);
  const [optionType, setOptionType] = useState<PresetType>("node");

  const [lastPosition, setLastPosition] = useState<number>(0);

  const content = selectedNodeData.content || "";

  const highlight = [
    {
      highlight: /(\$[\w]+)/g, // Highlight $ followed by word characters
      className: "output-variable",
    },
    {
      highlight: /({{.*?}})/g, // Highlight {{ followed by any characters inside }}
      className: "input-variable",
    },
    {
      highlight: /({{)/g, // Highlight plain {{
      className: "input-variable",
    },
    {
      highlight: /(\$)/g, // Highlight plain $
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

  // Function to show suggestions based on user input
  const showSuggestions = (value: string) => {
    if (value.endsWith("{{")) {
      setSuggestionList(inputsPresets);
      setOptionType("input");
    } else if (value.endsWith("$")) {
      setSuggestionList(nodesPresets);
      setOptionType("node");
    } else {
      setSuggestionList([]);
    }
  };

  const updateSuggestionListPosition = () => {
    if (suggestionListRef.current) {
      const textarea = document.querySelector(".highlight-within-textarea");
      if (textarea) {
        const textareaRect = textarea.getBoundingClientRect();
        suggestionListRef.current.style.left = `${textareaRect.left}px`;
        suggestionListRef.current.style.top = `${textareaRect.bottom}px`;
        suggestionListRef.current.style.width = `${textareaRect.width}px`;
      }
    }
  };

  const changeContent = (content: string, selection?: Selection | undefined) => {
    if (selection?.focus) {
      setLastPosition(selection.focus + 1);
    }

    cursorPositionRef.current = lastPosition;
    setSelectedNodeData({
      ...selectedNodeData,
      content,
    });
    setFirstAppend(false);
  };

  const addPreset = (type: PresetType, label: string) => {
    if (!label) return;

    let preset = "";
    if (type === "node") {
      const matchedNode = nodesPresets.find(node => node.label === label);
      if (matchedNode) {
        preset = content.endsWith("$") ? matchedNode.label.slice(1) : matchedNode.label; // Remove the first character
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

    if (firstAppend) {
      changeContent(content + preset + " ");
    } else {
      const start = content.slice(0, cursorPositionRef.current);
      const end = content.slice(cursorPositionRef.current);
      changeContent(start + preset + " " + end);
    }
    setLastPosition(val => val + preset.length);
    setSuggestionList([]); // clear
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
            onChoose={node => addPreset("node", node.label)}
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
            onChoose={input => addPreset("input", input.label)}
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
            value={content}
            highlight={highlight}
            placeholder="..."
            stripPastedStyles
            onChange={(newValue, selection) => {
              changeContent(newValue, selection);
              showSuggestions(newValue);
              updateSuggestionListPosition();
            }}
          />
          {suggestionList.length > 0 && (
            <Card
              ref={suggestionListRef}
              elevation={2}
              sx={{
                padding: "16px",
                minWidth: "200px",
                position: "absolute",
                zIndex: 999,
                right: 0,
                bgcolor: "surface.1",
                maxHeight: "300px",
                overflow: "auto",

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
                onChoose={option => addPreset(optionType, option.label)}
              />
            </Card>
          )}
        </Box>
      </Box>
    </Stack>
  );
};
