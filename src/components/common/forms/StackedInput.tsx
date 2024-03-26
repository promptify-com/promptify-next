import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import BackspaceOutlined from "@mui/icons-material/BackspaceOutlined";
import { useState } from "react";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  value: string | number | undefined;
  required: boolean;
  helperText: string | false | undefined;
  error: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onClear(): void;
}

export default function StackedInput({
  name,
  label,
  placeholder,
  value,
  required,
  helperText,
  error,
  onChange,
  onClear,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const allowClear = isFocused && value;

  return (
    <FormControl
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        ":not(:last-of-type)": {
          borderBottom: "1px solid",
          borderColor: "surfaceContainerHighest",
        },
        ":hover": { bgcolor: "surfaceContainerLow" },
        ...(isFocused && { bgcolor: "surfaceContainerLow" }),
      }}
    >
      <InputLabel
        sx={{
          flex: 1,
          position: "relative",
          transform: "none",
          p: "16px 8px 16px 24px",
          fontSize: 14,
          fontWeight: 500,
          color: "secondary.light",
        }}
      >
        {label}
      </InputLabel>
      <Stack
        flex={3}
        direction={"row"}
        alignItems={"center"}
        gap={3}
        sx={{
          p: "8px 16px",
          borderBottom: "1px solid",
          borderColor: isFocused ? "primary.main" : "transparent",
        }}
      >
        <TextField
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          helperText={helperText}
          error={error}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            flex: 1,
            ".MuiInputBase-root": {
              minHeight: "40px",
            },
            input: {
              p: 0,
              fontSize: 16,
              fontWeight: 400,
              color: "onSurface",
            },
            fieldset: {
              border: "none",
            },
          }}
        />
        <IconButton
          onClick={onClear}
          sx={{
            border: "none",
            height: "fit-content",
            visibility: allowClear ? "visible" : "hidden",
            svg: { color: "outline" },
            ":hover": {
              opacity: 0.8,
            },
          }}
        >
          <BackspaceOutlined />
        </IconButton>
      </Stack>
    </FormControl>
  );
}
