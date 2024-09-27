import { useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Typography from "@mui/material/Typography";

interface Props {
  label?: string;
  placeholder?: string;
  value: string | undefined;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const SystemPromptForm: React.FC<Props> = ({ label, placeholder, value, onChange = () => {}, disabled }) => {
  const [Value, setValue] = useState(value || "");
  const [fold, setFold] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Stack
      sx={{
        width: "100%",
        border: "1px solid rgba(0, 0, 0, 0.10)",
        borderRadius: 2,
        position: "relative",
      }}
      direction={fold ? "column" : "row"}
      alignItems={fold ? "flex-start" : "center"}
    >
      <IconButton
        onClick={() => setFold(!fold)}
        sx={{ opacity: 0.7, border: "none", position: "absolute", top: 0, right: 4 }}
      >
        {fold ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
      </IconButton>
      <Typography>{label}</Typography>
      <Input
        sx={{ width: "80%" }}
        placeholder={placeholder}
        value={Value}
        onChange={handleChange}
        disabled={disabled}
        multiline={fold}
        rows={fold ? 3 : 1}
      />
    </Stack>
  );
};

export default SystemPromptForm;
