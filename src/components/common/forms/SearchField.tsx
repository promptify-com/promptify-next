import React from "react";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import Search from "@mui/icons-material/Search";
import { SxProps } from "@mui/material";

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onPressEnter?(): void;
  disabled?: boolean;
  sx?: SxProps;
}

const SearchField: React.FC<Props> = ({ placeholder, value, onChange, onPressEnter, disabled, sx }) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        width: "calc(100% - 16px)",
        bgcolor: "surfaceContainerHigh",
        borderRadius: "999px",
        p: "8px",
        gap: "5px",
        overflowX: "auto",
        alignItems: "center",
        ...sx,
      }}
    >
      <IconButton
        size="small"
        sx={{
          color: "onSurface",
          border: "none",
          marginLeft: "0.5em",
          ":hover": { color: "tertiary" },
        }}
      >
        <Search />
      </IconButton>
      <InputBase
        onChange={e => {
          onChange(e.target.value);
        }}
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        sx={{
          flex: 1,
          fontSize: "13px",
          padding: "0px",
          fontFamily: "Poppins",
        }}
        onKeyPress={e => {
          if (e.key === "Enter") {
            onPressEnter?.();
          }
        }}
      />
    </Stack>
  );
};

export default SearchField;
