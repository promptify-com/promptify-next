import React, { useRef, useState } from "react";
import { PresetType } from "@/common/types/builder";
import { Options } from "../common/Options";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { IEditPrompts } from "@/common/types/builder";
import { getInputsFromString } from "@/common/helpers";
import { addPreset } from "@/common/helpers/addPreset";
import { HighlightTextarea } from "./HighlightWithinTextarea";
import { Selection } from "react-highlight-within-textarea";
import { getBuilderVarsPresets } from "@/common/helpers/getBuilderVarsPresets";

interface Props {
  selectedNodeData: IEditPrompts;
  setSelectedNodeData: (node: IEditPrompts) => void;
  nodes: IEditPrompts[];
}

export const NodeContentForm: React.FC<Props> = ({ selectedNodeData, setSelectedNodeData, nodes }) => {
  const cursorPositionRef = useRef(0);
  const [highlightedOption, setHighlitedOption] = useState("");

  const content = selectedNodeData.content || "";

  const { outputPresets, inputPresets } = getBuilderVarsPresets(nodes, selectedNodeData);

  const contentHandler = (content: string, selection?: Selection) => {
    const { focus } = selection ?? {};
    if (focus) {
      cursorPositionRef.current = focus;
    }
    setSelectedNodeData({
      ...selectedNodeData,
      content,
    });
  };

  const presetHandler = ({ type, label }: { type: PresetType; label: string }) => {
    addPreset({
      type,
      label,
      outputPresets,
      inputPresets,
      onChange: contentHandler,
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
      {(!!outputPresets.length || !!inputPresets.length) && (
        <Stack
          gap={1}
          sx={{
            p: "24px 32px",
          }}
        >
          {!!outputPresets.length && (
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
                type="output"
                variant="horizontal"
                options={outputPresets}
                onChoose={output => presetHandler({ type: "output", label: output.label })}
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
                onChoose={input => presetHandler({ type: "input", label: input.label })}
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
            onChange={contentHandler}
            outputPresets={outputPresets}
            inputPresets={inputPresets}
            highlitedValue={highlightedOption}
            setHighlitedValue={setHighlitedOption}
          />
        </Box>
      </Box>
    </Stack>
  );
};
