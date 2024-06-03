import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { DAYS, TIMES } from "./Constants";

interface Props {
  type: "date" | "time" | "month_date";
  onChange(item: number): void;
  defaultValue?: number;
  isDaysSelect?: boolean;
}

export default function DateTimeSelect({ type, onChange, defaultValue = 0 }: Props) {
  const [selectedItem, setSelectedItem] = useState(defaultValue);

  useEffect(() => onChange?.(selectedItem), [selectedItem]);

  const items = type === "date" ? DAYS : type === "time" ? TIMES : Array.from({ length: 27 }).map((_, i) => i + 1);

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
      {items.map((item, idx) => {
        return (
          <MenuItem
            key={item}
            value={type === "month_date" ? idx + 1 : idx}
          >
            {item}
          </MenuItem>
        );
      })}
    </Select>
  );
}
