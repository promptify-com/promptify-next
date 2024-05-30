import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { DAYS, TIMES } from "./Constants";

interface Props {
  type: "date" | "time";
  onChange(item: number): void;
}

export default function DateTimeSelect({ type, onChange }: Props) {
  const [selectedItem, setSelectedItem] = useState(0);

  useEffect(() => onChange?.(selectedItem), [selectedItem]);

  return (
    <Select
      value={selectedItem}
      onChange={e => setSelectedItem(e.target.value as number)}
      IconComponent={ExpandMore}
      MenuProps={{
        disableScrollLock: true,
      }}
      sx={{
        borderRadius: "99px",
        bgcolor: "#F7F5FC",
        color: "common.black",
        fontSize: 13,
        fontWeight: 500,
        ".MuiSelect-select": {
          p: "9px 24px",
        },
        svg: {
          width: 20,
          height: 20,
          top: "auto",
          color: "common.black",
        },
      }}
    >
      {(type === "date" ? DAYS : TIMES).map((item, idx) => (
        <MenuItem
          key={item}
          value={idx}
        >
          {item}
        </MenuItem>
      ))}
    </Select>
  );
}
