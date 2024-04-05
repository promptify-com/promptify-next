import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import BackspaceOutlined from "@mui/icons-material/BackspaceOutlined";
import { useState } from "react";
import type { SxProps } from "@mui/material";

interface Props {
  name?: string;
  label: string;
  placeholder?: string;
  value: string | number | undefined;
  required?: boolean;
  helperText?: string | false | undefined;
  error?: boolean;
  rows?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onClear(): void;
  sx?: SxProps;
}

export default function StackedInput({
  name,
  label,
  placeholder,
  value,
  required,
  helperText,
  error,
  rows,
  onChange,
  onClear,
  sx,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const allowClear = isFocused && value;

  return (
    <FormControl
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: rows ? "column" : "row",
        alignItems: "flex-start",
        ":not(:last-of-type)": {
          borderBottom: "1px solid",
          borderColor: "surfaceContainerHighest",
        },
        ":hover": { bgcolor: "surfaceContainerLow" },
        ...(isFocused && { bgcolor: "surfaceContainerLow" }),
        ...sx,
      }}
    >
      <InputLabel
        sx={{
          flex: 2,
          minWidth: "fit-content",
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
        flex={4}
        direction={"row"}
        alignItems={"center"}
        gap={3}
        sx={{
          p: rows ? "16px" : "8px 16px",
          ...(!rows && {
            borderBottom: "1px solid",
            borderColor: isFocused ? "primary.main" : "transparent",
          }),
        }}
      >
        <TextField
          name={name}
          placeholder={placeholder || "Type here..."}
          required={required}
          value={value}
          helperText={helperText}
          error={error}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...(rows && {
            multiline: true,
            rows,
          })}
          sx={{
            flex: 1,
            ".MuiInputBase-root": {
              p: { xs: rows ? "0 8px" : 0, md: 0 },
              "textarea::-webkit-scrollbar": {
                width: 0,
              },
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
