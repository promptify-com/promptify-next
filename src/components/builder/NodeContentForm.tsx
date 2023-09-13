import React, { useRef, useState } from "react";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import { INodesData } from "@/common/types/builder";
import { InlineOptions } from "../common/InlineOptions";
import { getInputsFromString } from "@/common/helpers";

interface Props {
  selectedNodeData: INodesData | null;
  nodes: INodesData[];
  onChange?: (value: string) => void;
}

export const NodeContentForm: React.FC<Props> = ({ selectedNodeData, onChange = () => {}, nodes }) => {
  const cursorPositionRef = useRef(0);
  const [firstAppend, setFirstAppend] = useState(true);

  const content = selectedNodeData?.content || "";

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
        type: item.type === "number" ? "integer" : "number",
      })),
    );

  const changeContent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, selectionStart } = e.target;
    onChange(value);
    cursorPositionRef.current = selectionStart || 0;
    setFirstAppend(false);
  };

  const addPreset = (type: "node" | "input", id: number | undefined) => {
    if (!id) return;

    let str = "";
    if (type === "node") {
      str = nodesPresets.find(node => node.id === id)?.label || "";
    } else {
      const input = inputsPresets.find(input => input.id === id);
      str = input ? "{{" + input.label + ":" + input.type + "}}" : "";
    }

    if (firstAppend) {
      onChange(content + str);
    } else {
      const start = content.slice(0, cursorPositionRef.current);
      const end = content.slice(cursorPositionRef.current);
      onChange(start + str + end);
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
            onChoose={node => addPreset("node", node.id)}
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
            onChoose={input => addPreset("input", input.id)}
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
        <TextField
          value={content}
          onFocus={() => setFirstAppend(false)}
          onChange={changeContent}
          placeholder="..."
          multiline
          sx={{
            width: "calc(100% - 64px)",
            border: "none",
            p: "24px 32px",
            ".MuiInputBase-root": {
              p: 0,
            },
            input: {
              fontSize: 14,
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "0.15px",
              p: 0,
            },
            fieldset: {
              border: "none",
              p: 0,
            },
          }}
        />
      </Box>
    </Stack>
  );
};
