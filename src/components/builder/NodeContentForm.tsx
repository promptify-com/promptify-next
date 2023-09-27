import React, { useEffect, useRef, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { Selection } from "react-highlight-within-textarea";

import { INodesData, PresetType } from "@/common/types/builder";
import { Options } from "../common/Options";
import { getInputsFromString } from "@/common/helpers";

import { addPreset } from "@/common/helpers/addPreset";
import { HighlightTextarea } from "./HighlightWithinTextarea";

interface Props {
  selectedNodeData: INodesData;
  setSelectedNodeData: (node: INodesData) => void;
  nodes: INodesData[];
}

export const NodeContentForm: React.FC<Props> = ({ selectedNodeData, setSelectedNodeData, nodes }) => {
  const cursorPositionRef = useRef(0);
  const [highlightedOption, setHighlitedOption] = useState("");

  const content = selectedNodeData.content || "";

  const otherNodes = nodes.filter(
    node =>
      (node.id !== selectedNodeData.id && node.id !== selectedNodeData.temp_id) ||
      (node.temp_id !== selectedNodeData.id && node.temp_id !== selectedNodeData.temp_id),
  );
  const nodePresets = otherNodes.map(node => ({ id: node.id, label: node.prompt_output_variable || node.title }));
  const inputPresets = otherNodes
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

  const changeContent = (content: string, selection?: Selection) => {
    const { focus } = selection ?? {};
    if (focus) {
      cursorPositionRef.current = focus;
    }
    setSelectedNodeData({
      ...selectedNodeData,
      content,
    });
  };

  const handlePreset = ({ type, label }: { type: PresetType; label: string }) => {
    addPreset({
      type,
      label,
      nodePresets,
      inputPresets,
      onChange: changeContent,
      cursorPositionRef,
      content,
    });
  };

  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      {(!!nodePresets.length || !!inputPresets.length) && (
        <Stack
          gap={1}
          sx={{
            p: "24px 32px",
          }}
        >
          {!!nodePresets.length && (
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
                OUTPUT VARIABLES:
              </Typography>
              <Options
                type="node"
                variant="horizontal"
                options={nodePresets}
                onChoose={node => handlePreset({ type: "node", label: node.label })}
              />
            </Stack>
          )}
          {!!inputPresets.length && (
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
                INPUTS VARIABLES:
              </Typography>
              <Options
                type="input"
                variant="horizontal"
                options={inputPresets}
                onChoose={input => handlePreset({ type: "input", label: input.label })}
              />
            </Stack>
          )}
        </Stack>
      )}
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
          <HighlightTextarea
            cursorPositionRef={cursorPositionRef}
            content={content}
            onChange={changeContent}
            nodePresets={nodePresets}
            inputPresets={inputPresets}
            highlitedValue={highlightedOption}
            setHighlitedValue={setHighlitedOption}
          />
        </Box>
      </Box>
    </Stack>
  );
};
