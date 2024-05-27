import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Check from "@mui/icons-material/Check";

interface Props {
  message: string;
  items: string[];
  onSelect(item: string): void;
}

export default function Choices({ message, items, onSelect }: Props) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

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
              disabled={!!selectedItem}
              sx={{
                bgcolor: selected ? "#6E45E9" : "#F7F5FC",
                color: selected ? "common.white" : "common.black",
                fontSize: 13,
                fontWeight: 500,
                p: "10px 24px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                ":hover": {
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                },
                ...(!!selectedItem && {
                  ":hover, :disabled": {
                    bgcolor: selected ? "#6E45E9" : "#F7F5FC",
                    color: selected ? "#ffffff" : "#00000073",
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
