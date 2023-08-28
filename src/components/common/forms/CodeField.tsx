import React from "react";
import { TextField } from "@mui/material";

interface Props {
  value?: string;
  onChange: (code: string) => void;
  onError?: (errors: string[]) => void;
}

const CodeField: React.FC<Props> = ({ value, onChange }) => {
  return (
    <TextField
      placeholder={`function add(a, b) {\n  return a + b;\n}`}
      multiline
      rows={10}
      name="code"
      fullWidth
      value={value}
      onChange={e => onChange(e.target.value)}
      sx={{ ".MuiInputBase-input": { overscrollBehavior: "contain" } }}
      InputProps={{
        sx: {
          fontFamily: "monospace",
          fontSize: 14,
          bgcolor: "grey.100",
          p: "10px",
        },
      }}
      variant="outlined"
    />
  );
};

export default CodeField;
