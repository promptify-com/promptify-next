import React from "react";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import Search from "@mui/icons-material/Search";

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onPressEnter(): void;
}

const SearchField: React.FC<Props> = ({ placeholder, value, onChange, onPressEnter }) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        width: { xs: "97%", sm: "100%" },
        paddingRight: "0.5em",
        gap: "5px",
        display: "flex",
        overflowX: "auto",
        alignItems: "center",
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
        fullWidth
        sx={{
          fontSize: "13px",
          padding: "0px",
          fontFamily: "Poppins",
        }}
        onKeyPress={e => {
          if (e.key === "Enter") {
            onPressEnter();
          }
        }}
      />
    </Stack>
  );
};

export default SearchField;
