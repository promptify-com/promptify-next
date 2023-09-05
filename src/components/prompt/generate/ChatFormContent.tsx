import React from "react";
import { List, ListItemButton, InputLabel, Typography, Box, Popover, Grid, IconButton } from "@mui/material";
import { Clear } from "@mui/icons-material";

import { IPromptInput } from "@/common/types/prompt";
import { PromptParams, ResInputs } from "@/core/api/dto/prompts";
import { GeneratorParamSlider } from "./GeneratorParamSlider";

export interface InputsErrors {
  [key: string]: number | boolean;
}
interface Input extends IPromptInput {
  prompt: number;
}
interface Param {
  prompt: number;
  param: PromptParams;
}
type SelectedNodeType = { questionId: number; item: Input | Param | null } | null;

interface ChatFormCntentProps {
  PromptsFields: (Input | Param)[];
  errors: InputsErrors;
  nodeInputs: ResInputs[];
  nodeParams: any;
  setNodeParams: (obj: any) => void;
  getItemName: (item: Input | Param) => string;
  selectedNode: SelectedNodeType;
  setSelectedNode: (selectedNode: SelectedNodeType) => void;
}

const ChatFormContent: React.FC<ChatFormCntentProps> = ({
  PromptsFields,
  errors,
  selectedNode,
  nodeInputs,
  nodeParams,
  setNodeParams,
  getItemName,
  setSelectedNode,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleItemClick = (event: React.MouseEvent<HTMLButtonElement>, item: Input | Param) => {
    const questionId = PromptsFields.findIndex(field => field === item);
    if ("param" in item) {
      setAnchorEl(event.currentTarget);
    }
    setSelectedNode({ questionId, item });
  };

  const handleChangeScore = (score: number) => {
    if (selectedNode?.item && "param" in selectedNode.item) {
      const { param, prompt } = selectedNode.item;
      const newArray = JSON.parse(JSON.stringify(nodeParams));
      const matchingObject = newArray.find((obj: { id: number }) => obj.id === prompt);

      if (matchingObject) {
        const matchingContext = matchingObject.contextual_overrides.find(
          (c: any) => c.parameter === param.parameter.id,
        );

        if (matchingContext) {
          matchingContext.score = score;
        } else {
          matchingObject.contextual_overrides.push({ parameter: param.parameter.id, score });
        }
      } else {
        newArray.push({ id: prompt, contextual_overrides: [{ parameter: param.parameter.id, score }] });
      }
      setNodeParams(newArray);
    }
  };

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {PromptsFields.map((item, i) => {
        const itemName = getItemName(item);
        const inputValue = nodeInputs.find(prompt => prompt.id === item.prompt)?.inputs[itemName]?.value ?? "";
        const isRequired = "required" in item ? item.required : false;
        return (
          <ListItemButton
            key={i}
            selected={i === selectedNode?.questionId}
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
                  color: errors[itemName] ? "error.main" : !!inputValue ? "success.main" : "#375CA9",
                }}
              >
                <Typography color={errors[itemName] ? "error.main" : !!inputValue ? "success.main" : "#375CA9"}>
                  {i + 1}. {itemName}
                  {isRequired ? "*" : ""}: {inputValue}
                </Typography>
              </InputLabel>
            </Box>
          </ListItemButton>
        );
      })}

      <Popover
        open={!!anchorEl}
        keepMounted
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {selectedNode?.item && "param" in selectedNode.item ? (
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
              {" "}
              {selectedNode.questionId + 1}.{selectedNode.item.param.parameter.name}
            </Typography>
            <GeneratorParamSlider
              descriptions={selectedNode.item.param.descriptions}
              activeScore={selectedNode.item.param.score}
              setScore={score => handleChangeScore(score)}
              is_editable={selectedNode.item.param.is_editable}
            />
          </Grid>
        ) : null}
      </Popover>
    </List>
  );
};

export default ChatFormContent;
