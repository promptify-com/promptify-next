import React from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Engine } from "@/core/api/dto/templates";

type SelectLabelsProps = {
  label: string;
  engineSelected: string;
  setEngineSelected: Function;
  engines: Engine[];
};

const SelectLabels: React.FC<SelectLabelsProps> = ({
  label,
  engineSelected,
  setEngineSelected,
  engines,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    setEngineSelected(!!event.target.value ? event.target.value : "");
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={`${engineSelected}`}
        onChange={handleChange}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{
          height: "35px",
          borderRadius: "4em",
          fontSize: "14px",
          "&:hover": {
            transform: "scale(1.05)",
            cursor: "pointer",
            border: "none",
          },
        }}
      >
        <MenuItem value="">{label}</MenuItem>
        {!!engines &&
          engines.length > 0 &&
          engines.map((el, idx) => (
            <MenuItem
              selected={!!engineSelected && `${el.id}` === engineSelected}
              key={idx}
              value={el.id}
            >
              {el.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default SelectLabels;
