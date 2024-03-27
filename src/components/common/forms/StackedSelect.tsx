import React, { ReactNode, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material";
import Stack from "@mui/material/Stack";

interface IProps {
  label: string;
  value: string;
  children: ReactNode[];
  onChange(e: SelectChangeEvent): void;
}

export const StackedSelect: React.FC<IProps> = ({ label, value, children, onChange }) => {
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
          height: "100%",
        }}
      >
        <Select
          value={value}
          onChange={onChange}
          MenuProps={{
            disableScrollLock: true,
            sx: {
              ".MuiList-root": {
                p: 0,
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
