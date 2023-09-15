import React, { useRef, useState } from "react";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import { INodesData } from "@/common/types/builder";
import { InlineOptions } from "../common/InlineOptions";
import { getInputsFromString } from "@/common/helpers";
import HighlightWithinTextarea, { Selection } from "react-highlight-within-textarea";

type PresetType = "node" | "input";
interface Props {
  selectedNodeData: INodesData;
  setSelectedNodeData: (node: INodesData) => void;
  nodes: INodesData[];
}

export const NodeContentForm: React.FC<Props> = ({ selectedNodeData, setSelectedNodeData, nodes }) => {
  const cursorPositionRef = useRef(0);
  const [firstAppend, setFirstAppend] = useState(true);
  const content = selectedNodeData?.content || "";

  const highlight = [
    {
      highlight: /(\$[\w]+)/g,
      className: "output-variable",
    },
    {
      highlight: /({{.*?}})/g,
      className: "input-variable",
    },
  ];

  const otherNodes = nodes.filter(
    node =>
      (node.id !== selectedNodeData?.id && node.id !== selectedNodeData?.temp_id) ||
      (node.temp_id !== selectedNodeData?.id && node.temp_id !== selectedNodeData?.temp_id),
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

  const changeContent = (content: string, selection?: Selection | undefined) => {
    cursorPositionRef.current = selection?.focus || 0;
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
      preset = nodesPresets.find(node => node.label === label)?.label || "";
    } else {
      const input = inputsPresets.find(input => input.label === label);
      const type = input?.type;
      preset = input
        ? "{{" + input.label + ":" + type + ":" + input.required + (input.choices ? `:"${input.choices}"` : "") + "}}"
        : "";
    }

    if (firstAppend) {
      changeContent(content + preset + " ");
    } else {
      const start = content.slice(0, cursorPositionRef.current);
      const end = content.slice(cursorPositionRef.current);
      changeContent(start + preset + " " + end);
    }
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
          <InlineOptions
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
          <InlineOptions
            options={inputsPresets}
            onChoose={input => addPreset("input", input.label)}
            bgcolor="#E0F2F1"
            color="#00897B"
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
        <div className="area">
          <HighlightWithinTextarea
            value={content}
            highlight={highlight}
            placeholder="..."
            onChange={changeContent}
          />
        </div>
      </Box>
    </Stack>
  );
};
