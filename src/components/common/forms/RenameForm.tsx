import React, { useState } from "react";
import { Box, Button, Stack, TextField, alpha } from "@mui/material";
import { Done } from "@mui/icons-material";
import { theme } from "@/theme";

interface Props {
  label?: string;
  placeholder?: string;
  initialValue: string | undefined;
  onChange?: (value: string) => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const RenameForm: React.FC<Props> = ({
  label,
  placeholder,
  initialValue,
  onChange = () => {},
  onSave,
  onCancel,
  disabled,
}) => {
  const [value, setValue] = useState(initialValue || "");

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box sx={{ py: "8px" }}>
        <TextField
          variant="standard"
          fullWidth
          label={label ? `Rename ${label}` : ""}
          placeholder={placeholder}
          value={value}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
      </Box>
      <Stack
        flexDirection={"row"}
        alignItems={"flex-start"}
        gap={1}
        sx={{ py: "8px" }}
      >
        <Button
          variant="contained"
          startIcon={<Done />}
          sx={{
            borderColor: "primary.main",
            bgcolor: "primary.main",
            color: "onPrimary",
            fontSize: 13,
            fontWeight: 500,
            p: "4px 12px",
            ":hover": { color: "primary.main" },
            ":disabled": { bgcolor: "transparent", borderColor: alpha(theme.palette.primary.main, 0.15) },
          }}
          disabled={!value?.trim().length || disabled}
          onClick={() => onSave(value)}
        >
          Ok
        </Button>
        <Button
          variant="text"
          sx={{
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            bgcolor: "transparent",
            color: "onSurface",
            fontSize: 13,
            fontWeight: 500,
            p: "4px 12px",
          }}
          disabled={disabled}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};
