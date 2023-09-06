import React, { useState } from "react";
import { List, ListItemButton, InputLabel, Typography, Box, Popover, Grid, IconButton } from "@mui/material";
import { Clear } from "@mui/icons-material";

import { Input, Param, ResInputs } from "@/core/api/dto/prompts";
import { GeneratorParamSlider } from "./GeneratorParamSlider";
import { SelectedNodeType } from "./ChatMode";
import { getInputValue, isParam, isParamSelected, onScoreChange } from "@/common/helpers/handleGeneratePrompt";
import { InputsErrors } from ".";

interface ChatFormCntentProps {
  promptsFields: (Input | Param)[];
  errors: InputsErrors;
  nodeInputs: ResInputs[];
  nodeParams: any;
  setNodeParams: (obj: any) => void;
  getItemName: (item: Input | Param) => string;
  selectedNode: SelectedNodeType;
  setSelectedNode: (selectedNode: SelectedNodeType) => void;
}

const ChatFormContent: React.FC<ChatFormCntentProps> = ({
  promptsFields,
  errors,
  selectedNode,
  nodeInputs,
  nodeParams,
  setNodeParams,
  getItemName,
  setSelectedNode,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [score, setScore] = useState<number | null>(null);
  const [paramSliderValues, setParamSliderValues] = useState<{ [paramId: number]: number }>({});

  const handleItemClick = (event: React.MouseEvent<HTMLButtonElement>, item: Input | Param) => {
    const questionId = promptsFields.findIndex(field => field === item);
    if (isParam(item)) {
      setAnchorEl(event.currentTarget);
      const initialScore = paramSliderValues[item.param.parameter.id] || 0;
      setScore(initialScore);
    }
    setSelectedNode({ questionId, item });
  };

  const handleChangeScore = (newScore: number) => {
    if (isParamSelected(selectedNode)) {
      const { item } = selectedNode;
      if (item) {
        const { param, prompt } = item;
        onScoreChange(nodeParams, setNodeParams, prompt, newScore, param.parameter.id);
        setParamSliderValues({ ...paramSliderValues, [param.parameter.id]: newScore });
      }
    }
  };

  const isRequired = (item: Input | Param) => ("required" in item ? item.required : false);

  const getLabelColor = (
    itemName: string,
    inputValue: string | number,
    item: Input | Param,
    score: number | null,
    selectedNode: SelectedNodeType,
    errors: InputsErrors,
    paramSliderValues: { [paramId: number]: number },
  ) => {
    if (isParam(item) && score !== null && selectedNode?.item === item) {
      if (score !== item.param.score) {
        return "success.main";
      } else {
        return "initial";
      }
    } else if (errors[itemName]) {
      return "error.main";
    } else if (isParam(item) && paramSliderValues[item.param?.parameter.id] !== undefined) {
      return "success.main";
    } else if (!!inputValue) {
      return "success.main";
    } else {
      return "#375CA9";
    }
  };

  function getParamProperties(selectedNode: SelectedNodeType) {
    if (isParamSelected(selectedNode)) {
      const { param } = selectedNode.item;
      return {
        name: param.parameter.name ?? "",
        descriptions: param.descriptions ?? [],
        is_editable: param.is_editable ?? false,
      };
    }
    return null;
  }
  const paramProperties = getParamProperties(selectedNode);

  const paramName = paramProperties?.name ?? "";
  const paramDescriptions = paramProperties?.descriptions ?? [];
  const paramEditable = paramProperties?.is_editable ?? false;

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {promptsFields.map((item, idx) => {
        const itemName = getItemName(item);
        const inputValue = getInputValue(nodeInputs, item);
        const required = isRequired(item);
        const labelColor = getLabelColor(itemName, inputValue, item, score, selectedNode, errors, paramSliderValues);

        return (
          <ListItemButton
            key={idx}
            selected={idx === selectedNode?.questionId}
            //@ts-ignore
            onClick={e => handleItemClick(e, item)}
            sx={{
              width: "fit-content",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <Box
              display={"flex"}
              gap={"2px"}
              alignItems={"center"}
            >
              <InputLabel
                sx={{
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "pre-wrap",
                  color: labelColor,
                }}
              >
                <Typography color={labelColor}>
                  {selectedNode?.questionId}. {itemName}
                  {required ? "*" : ""}: {inputValue}
                </Typography>
              </InputLabel>
            </Box>
          </ListItemButton>
        );
      })}

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        keepMounted
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {isParamSelected(selectedNode) ? (
          <Grid
            width={"300px"}
            borderRadius={"16px"}
            overflow={"hidden"}
            p={"16px"}
            position={"relative"}
            display={"flex"}
            flexDirection={"column"}
            gap={"16px"}
          >
            <IconButton
              size="small"
              onClick={() => setAnchorEl(null)}
              sx={{
                border: "none",
                position: "absolute",
                top: 2,
                right: 2,
              }}
            >
              <Clear />
            </IconButton>

            <Typography>
              {selectedNode.questionId}.{paramName}
            </Typography>
            <GeneratorParamSlider
              activeScore={score}
              setScore={newScore => handleChangeScore(newScore)}
              descriptions={paramDescriptions}
              is_editable={paramEditable}
            />
          </Grid>
        ) : null}
      </Popover>
    </List>
  );
};

export default ChatFormContent;
