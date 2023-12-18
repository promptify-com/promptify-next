import { IPromptInput } from "@/common/types/prompt";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";

interface Props {
  isGenerating: boolean;
  value: string | number | File;
  input: IPromptInput;
  onChange: (value: string | File, input: IPromptInput) => void;
}

function Choices({ isGenerating, value, input, onChange }: Props) {
  return (
    <Select
      disabled={isGenerating}
      sx={{
        ".MuiSelect-select": {
          p: "3px 12px",
          fontSize: 14,
          fontWeight: 400,
          opacity: value ? 1 : 0.7,
        },
        ".MuiOutlinedInput-notchedOutline, .Mui-focused": {
          borderRadius: "8px",
          borderWidth: "1px !important",
          borderColor: "secondary.main",
        },
      }}
      MenuProps={{
        sx: { ".MuiMenuItem-root": { fontSize: 14, fontWeight: 400 } },
      }}
      value={value}
      onChange={e => onChange(e.target.value as string, input)}
      displayEmpty
    >
      <MenuItem
        value=""
        sx={{ opacity: 0.7 }}
      >
        Select an option
      </MenuItem>
      {input.choices?.map(choice => (
        <MenuItem
          key={choice}
          value={choice}
          selected={value === choice}
        >
          {choice}
        </MenuItem>
      ))}
    </Select>
  );
}

export default Choices;
