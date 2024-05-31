import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Check from "@mui/icons-material/Check";

interface Props {
  message: string;
  items: string[];
  onSelect(item: string): void;
  defaultValue?: string;
}

export default function Choices({ message, items, onSelect, defaultValue = "" }: Props) {
  const [selectedItem, setSelectedItem] = useState(defaultValue);

  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
    onSelect(item);
  };

  return (
    <Stack gap={4}>
      {message && (
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"common.black"}
        >
          {message}
        </Typography>
      )}
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        {items.map(item => {
          const selected = selectedItem === item;
          return (
            <Button
              key={item}
              onClick={() => handleSelectItem(item)}
              {...(selected && { endIcon: <Check /> })}
              sx={{
                bgcolor: selected ? "#6E45E9" : "#F7F5FC",
                color: selected ? "common.white" : "common.black",
                fontSize: 13,
                fontWeight: 500,
                textTransform: "capitalize",
                p: "6px 24px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                ":hover": {
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                },
                ...(!!selected && {
                  ":hover": {
                    bgcolor: "#6E45E9",
                    color: "#ffffff",
                  },
                }),
              }}
            >
              {item}
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
}
