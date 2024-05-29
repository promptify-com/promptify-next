import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ExpandMore from "@mui/icons-material/ExpandMore";

const TIMES = [
  "12:00 AM - EST",
  "1:00 AM - EST",
  "2:00 AM - EST",
  "3:00 AM - EST",
  "4:00 AM - EST",
  "5:00 AM - EST",
  "6:00 AM - EST",
  "7:00 AM - EST",
  "8:00 AM - EST",
  "9:00 AM - EST",
  "10:00 AM - EST",
  "11:00 AM - EST",
  "12:00 PM - EST",
  "1:00 PM - EST",
  "2:00 PM - EST",
  "3:00 PM - EST",
  "4:00 PM - EST",
  "5:00 PM - EST",
  "6:00 PM - EST",
  "7:00 PM - EST",
  "8:00 PM - EST",
  "9:00 PM - EST",
  "10:00 PM - EST",
  "11:00 PM - EST",
];

interface Props {
  message: string;
  onSelect(time: string): void;
}

export default function TimeSelect({ message, onSelect }: Props) {
  const [selectedTime, setSelectedTime] = useState<string | null>(TIMES[0]);

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
        <Select
          value={selectedTime}
          onChange={e => {
            setSelectedTime(e.target.value);
          }}
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
          {TIMES.map(time => (
            <MenuItem
              key={time}
              value={time}
            >
              {time}
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={() => {
            if (selectedTime) {
              onSelect(selectedTime);
            }
          }}
          disabled={!selectedTime}
          variant="contained"
          sx={{
            bgcolor: "#6E45E9",
            color: "common.white",
            p: "7px 24px",
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "unset",
          }}
        >
          Set
        </Button>
      </Stack>
    </Stack>
  );
}
