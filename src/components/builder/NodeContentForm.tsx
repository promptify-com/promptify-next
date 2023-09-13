import React from "react";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import { INodesData } from "@/common/types/builder";
import { InlineOptions } from "../common/InlineOptions";
import { getInputsFromString } from "@/common/helpers";

interface Props {
  content: string | undefined;
  nodes: INodesData[];
  onChange?: (value: string) => void;
}

export const NodeContentForm: React.FC<Props> = ({ content = "", onChange = () => {}, nodes }) => {
  const nodesOptions = nodes.map(node => ({ id: node.id, label: node.prompt_output_variable }));
  const inputsOptions = nodes.map(node => ({ id: node.id, label: getInputsFromString(node.content) }));

  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        flexWrap={"wrap"}
        gap={0.5}
        sx={{
          p: "24px 32px",
        }}
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
          options={nodesOptions}
          onChoose={id => console.log(id)}
        />
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
          options={nodesOptions}
          onChoose={id => console.log(id)}
        />
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
          onChange={e => onChange(e.target.value)}
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
