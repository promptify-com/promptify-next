import React, { ReactNode, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import type { SelectChangeEvent, SxProps } from "@mui/material";
import Stack from "@mui/material/Stack";

interface IProps {
  name?: string;
  label: string;
  value: string;
  children: ReactNode[];
  onChange(e: SelectChangeEvent): void;
  sx?: SxProps;
}

export const StackedSelect: React.FC<IProps> = ({ name, label, value, children, onChange, sx }) => {
  const [isFocused, setIsFocused] = useState(false);

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
        ...sx,
      }}
    >
      <InputLabel
        sx={{
          flex: 2,
          position: "relative",
          transform: "none",
          p: "16px 8px 16px 24px",
          fontSize: 14,
          fontWeight: 500,
          color: "secondary.light",
          whiteSpace: "pre-wrap",
          "&.Mui-focused": {
            color: "secondary.light",
          },
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
          p: "16px",
          borderBottom: "1px solid",
          borderColor: isFocused ? "primary.main" : "transparent",
        }}
      >
        <Select
          name={name}
          value={value}
          onChange={onChange}
          displayEmpty
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          MenuProps={{
            disableScrollLock: true,
            sx: {
              ".MuiList-root": {
                p: 0,
                fontSize: 16,
                fontWeight: 400,
                color: "onSurface",
              },
              ".MuiMenuItem-root": {
                borderTop: "1px solid #E3E3E3",
                gap: 2,
                fontSize: 16,
                fontWeight: 400,
                color: "onSurface",
              },
            },
          }}
          sx={{
            flex: 1,
            ".MuiSelect-select": {
              p: 0,
              img: { display: "none" },
            },
            fieldset: {
              border: "none",
            },
          }}
        >
          {children}
        </Select>
      </Stack>
    </FormControl>
  );
};
