import React, { useState } from "react";
import { List, ListItemButton, InputLabel, Typography, Box, Popover, Grid, IconButton } from "@mui/material";
import { IPromptInput } from "@/common/types/prompt";
import { PromptParams, ResInputs } from "@/core/api/dto/prompts";
import { Clear } from "@mui/icons-material";
import { GeneratorParamSlider } from "../GeneratorParamSlider";

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

interface ChatFormCntentProps {
  PromptsFields: (Input | Param)[];
  errors: InputsErrors;
  nodeInputs: ResInputs[];
  getItemName: (item: Input | Param) => string;
}

const ChatFormCntent: React.FC<ChatFormCntentProps> = ({ PromptsFields, errors, nodeInputs, getItemName }) => {
  const [clickedItem, setClickedItem] = useState<{ questionId: number; item: Input | Param | null } | null>({
    questionId: 0,
    item: null,
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleItemClick = (event: React.MouseEvent<HTMLButtonElement>, item: Input | Param) => {
    const questionId = PromptsFields.findIndex(field => field === item);
    if ("param" in item) {
      setAnchorEl(event.currentTarget);
    }
    setClickedItem({ questionId, item });
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
            selected={i === clickedItem?.questionId}
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
      {anchorEl && (
        <Popover
          open
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {clickedItem?.item && "param" in clickedItem.item ? (
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
                {clickedItem.questionId + 1}.{clickedItem.item.param.parameter.name}
              </Typography>
              <GeneratorParamSlider
                descriptions={clickedItem.item.param.descriptions}
                activeScore={clickedItem.item.param.score}
                setScore={() => {}}
                is_editable={clickedItem.item.param.is_editable}
              />
            </Grid>
          ) : null}
        </Popover>
      )}
    </List>
  );
};

export default ChatFormCntent;
