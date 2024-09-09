import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Check from "@mui/icons-material/Check";
import { FrequencyType } from "../Automation/types";

interface Props {
  message?: string;
  items: string[];
  onSelect(item: string): void;
  selectedValue: FrequencyType | undefined
}

export default function Choices({ message, items, onSelect, selectedValue }: Props) {
  
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
        gap={{ xs: 1, md: 2 }}
      >
        {items.map(item => {
          const selected = selectedValue === item;
          return (
            <Button
              key={item}
              onClick={() => onSelect(item)}
              {...(selected && { endIcon: <Check /> })}
              sx={{
                bgcolor: selected ? "#6E45E9" : "#F7F5FC",
                color: selected ? "common.white" : "common.black",
                fontSize: { xs: 11, md: 13 },
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
