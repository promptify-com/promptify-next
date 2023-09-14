import React, { useRef, useState } from "react";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import { INodesData } from "@/common/types/builder";
import { InlineOptions } from "../common/InlineOptions";
import { getInputsFromString } from "@/common/helpers";
import HighlightWithinTextarea from "react-highlight-within-textarea";

interface Props {
  selectedNodeData: INodesData | null;
  nodes: INodesData[];
  onChange?: (value: string) => void;
}

export const NodeContentForm: React.FC<Props> = ({ selectedNodeData, onChange = () => {}, nodes }) => {
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
    .map(node => ({ id: node.id, label: getInputsFromString(node.content) }))
    .filter(node => node.label && node.label.length)
    .flatMap(node =>
      node.label.map(item => ({
        id: node.id,
        label: item.name,
        type: item.type.replace("number", "integer"),
      })),
    );

  const changeContent = (value: string, selection: any) => {
    const { anchor, focus } = selection;
    cursorPositionRef.current = focus || 0;
    onChange(value);
    setFirstAppend(false);
  };

  const addPreset = (type: "node" | "input", label: string | undefined) => {
    if (!label) return;

    let str = "";
    if (type === "node") {
      str = nodesPresets.find(node => node.label === label)?.label || "";
    } else {
      const input = inputsPresets.find(input => input.label === label);
      const type = input?.type.replace("number", "integer");
      str = input ? "{{" + input.label + ":" + type + "}}" : "";
    }

    if (firstAppend) {
      onChange(content + str + " ");
    } else {
      const start = content.slice(0, cursorPositionRef.current);
      const end = content.slice(cursorPositionRef.current);
      onChange(start + str + " " + end);
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
