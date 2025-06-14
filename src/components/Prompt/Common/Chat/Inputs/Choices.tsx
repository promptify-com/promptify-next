import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import type { IPromptInput } from "@/common/types/prompt";
import type { PromptInputType } from "@/components/Prompt/Types";

interface Props {
  isGenerating: boolean;
  value: PromptInputType;
  input: IPromptInput;
  onChange: (value: string | File, input: IPromptInput) => void;
  disabled?: boolean;
}

function Choices({ isGenerating, value, input, onChange, disabled }: Props) {
  return (
    <Select
      disabled={disabled || isGenerating}
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
        disableScrollLock: true,
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
