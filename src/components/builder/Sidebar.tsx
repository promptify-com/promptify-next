import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { EditableTextField } from "@/components/blocks";
import { PromptIcon, TrashIcon } from "@/assets/icons";
import { IEngines } from "@/common/types";
import { Stylizer } from "./Stylizer";
import { getStringsFromPrompt } from "@/common/helpers/getStringsFromPrompt";
import { Prompts } from "@/core/api/dto/prompts";
import {
  INodesData,
  IPromptOptions,
  IPromptParams,
} from "@/common/types/builder";
import { Options } from "./Options";

interface ISidebar {
  engines: IEngines[];
  prompts: Prompts[];
  selectedNode: any;
  removeNode: () => void;
  updateTitle: (value: string) => void | undefined;
  nodeCount: number;
  nodesData: INodesData[] | null;
  setNodesData: (value: INodesData[]) => void;
  selectedNodeData: INodesData | null;
  setSelectedNodeData: (value: INodesData) => void;
}

export interface Prompt {
  name: string;
  fullName: string;
  type: string;
}

export const Sidebar = ({
  engines,
  selectedNode,
  removeNode,
  updateTitle,
  nodesData,
  setNodesData,
  selectedNodeData,
}: ISidebar) => {
  const [parsedTexts, setParsedTexts] = useState<any[]>([]);

  const changeTitle = (title: string) => {
    const findSelectedNode = nodesData?.find((node) => {
      return (
        node?.id?.toString() === selectedNode?.id ||
        node?.temp_id === selectedNode?.temp_id
      );
    });

    const otherNodes = nodesData?.filter((node) => {
      return (
        node?.id?.toString() !== findSelectedNode?.id?.toString() ||
        node?.temp_id !== findSelectedNode?.temp_id
      );
    });

    if (findSelectedNode && otherNodes) {
      findSelectedNode.title = title;
      setNodesData([...otherNodes, findSelectedNode]);
      updateTitle(title);
    }
  };

  const changeEngineId = (id: number) => {
    const findSelectedNode = nodesData?.find((node) => {
      return (
        node?.id?.toString() === selectedNode?.id ||
        node?.temp_id === selectedNode?.temp_id
      );
    });

    const otherNodes = nodesData?.filter((node) => {
      return (
        node?.id?.toString() !== findSelectedNode?.id?.toString() ||
        node?.temp_id !== findSelectedNode?.temp_id
      );
    });

    if (findSelectedNode && otherNodes) {
      findSelectedNode.engine_id = id;
      setNodesData([...otherNodes, findSelectedNode]);
    }
  };

  const changeText = (text: string) => {
    const findSelectedNode = nodesData?.find((node) => {
      return (
        node?.id?.toString() === selectedNode?.id ||
        node?.temp_id === selectedNode?.temp_id
      );
    });

    const otherNodes = nodesData?.filter((node) => {
      return (
        node?.id?.toString() !== findSelectedNode?.id?.toString() ||
        node?.temp_id !== findSelectedNode?.temp_id
      );
    });

    if (findSelectedNode && otherNodes) {
      findSelectedNode.content = text;
      setNodesData([...otherNodes, findSelectedNode]);
    }
  };

  const changePromptParams = (params: IPromptParams[]) => {
    const findSelectedNode = nodesData?.find((node) => {
      return (
        node?.id?.toString() === selectedNode?.id ||
        node?.temp_id === selectedNode?.temp_id
      );
    });

    const otherNodes = nodesData?.filter((node) => {
      return (
        node?.id?.toString() !== findSelectedNode?.id?.toString() ||
        node?.temp_id !== findSelectedNode?.temp_id
      );
    });

    if (findSelectedNode && otherNodes) {
      findSelectedNode.parameters = params;
      setNodesData([...otherNodes, findSelectedNode]);
    }
  };

  const changePromptOptions = (options: IPromptOptions) => {
    // TODO: code to be refactored by creating findNode and filterNodes and apply it to all functions
    const findSelectedNode = nodesData?.find((node) => {
      return (
        node?.id?.toString() === selectedNode?.id ||
        node?.temp_id === selectedNode?.temp_id
      );
    });

    const otherNodes = nodesData?.filter((node) => {
      return (
        node?.id?.toString() !== findSelectedNode?.id?.toString() ||
        node?.temp_id !== findSelectedNode?.temp_id
      );
    });

    if (findSelectedNode && otherNodes) {
      findSelectedNode.output_format = options.output_format;
      findSelectedNode.model_parameters = options.model_parameters;
      findSelectedNode.is_visible = options.is_visible;
      findSelectedNode.show_output = options.show_output;
      findSelectedNode.prompt_output_variable = options.prompt_output_variable;
      setNodesData([...otherNodes, findSelectedNode]);
    }
  };

  useEffect(() => {
    setParsedTexts(getStringsFromPrompt(selectedNodeData?.content || ""));
  }, [selectedNodeData?.content]);

  return (
    <Box height="100%" overflow="scroll">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
        borderBottom="1px solid grey"
        paddingTop="25px"
        paddingBottom="25px"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <PromptIcon />
          <Box flexDirection="column" ml="20px">
            <EditableTextField
              value={selectedNodeData?.title || ""}
              fontSize="1.2rem"
              setValue={changeTitle}
            />

            <FormControl variant="standard" fullWidth>
              {engines.length ? (
                <Select
                  disableUnderline
                  value={selectedNodeData?.engine_id || 1}
                  onChange={(e) => changeEngineId(Number(e.target.value))}
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(228, 219, 233, 0.25)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(228, 219, 233, 0.25)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(228, 219, 233, 0.25)",
                    },
                    ".MuiSvgIcon-root ": {
                      fill: "white !important",
                    },
                    ".MuiSelect-nativeInput": {
                      border: "2px solid red",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#373737",
                        color: "white",
                      },
                    },
                  }}
                >
                  {engines.map((engine) => {
                    return (
                      <MenuItem value={engine.id} key={engine.id}>
                        {engine.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              ) : (
                <CircularProgress size={20} />
              )}
            </FormControl>
          </Box>
        </Box>

        <IconButton sx={{ border: "none" }} onClick={removeNode}>
          <TrashIcon />
        </IconButton>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        paddingTop="50px"
        paddingBottom="25px"
      >
        <Box width="80%">
          <EditableTextField
            multiline
            value={selectedNodeData?.content || ""}
            setValue={changeText}
            color="rgba(255, 255, 255, 0.6)"
            style={{
              fontWeight: "500",
              fontSize: "1rem",
              fontFamily: "Space Mono",
              display: "inline",
            }}
          />
        </Box>
        <Box display="flex" flexDirection="column" width="100%">
          {parsedTexts.map((text, id) => {
            return (
              <Box key={id}>
                <Box
                  display="flex"
                  flexDirection="row"
                  mt="25px"
                  mb="25px"
                  ml="5rem"
                >
                  <Typography
                    fontSize="1rem"
                    fontFamily="Space Mono"
                    color="#FFF"
                    sx={{
                      opacity: 0.6,
                    }}
                  >
                    {text.title}:&nbsp;
                  </Typography>
                  <Typography
                    fontSize="1rem"
                    fontFamily="Space Mono"
                    color="#FFF"
                  >
                    {text.text}
                  </Typography>
                </Box>
                <Box borderBottom="1px solid grey" />
              </Box>
            );
          })}
        </Box>
      </Box>
      <Stylizer
        changePromptParams={changePromptParams}
        selectedNodeData={selectedNodeData}
      />
      <Options
        onUpdateNodeOptions={changePromptOptions}
        prevOptions={selectedNodeData}
      />
    </Box>
  );
};
