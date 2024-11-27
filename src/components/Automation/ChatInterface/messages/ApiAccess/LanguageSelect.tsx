import { type Dispatch } from "react";
import { SelectChangeEvent } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

interface Props {
  lang: string;
  setLang: Dispatch<string>;
}

export const langType = [
  { label: "cUrl", value: "shell" },
  { label: "PHP - cUrl", value: "php" },
  { label: "Python - Requests", value: "python" },
  { label: "JavaScript - Fetch", value: "javascript" },
];

export default function LanguageSelect({ lang, setLang }: Props) {
  const handleChange = (e: SelectChangeEvent<string>) => {
    setLang(e.target.value);
  };
  return (
    <Select
      value={lang}
      onChange={handleChange}
      inputProps={{ MenuProps: { disableScrollLock: true } }}
      sx={{
        fontSize: 14,
        fontWeight: 500,
        borderRadius: "999px",
        p: "8px 16px",
        fieldset: {
          border: "none",
          p: 0,
        },
        ".MuiSelect-select": {
          p: 0,
          pr: "16px !important",
        },
        ":hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      {langType.map(item => (
        <MenuItem
          key={item.value}
          value={item.value}
        >
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
}
