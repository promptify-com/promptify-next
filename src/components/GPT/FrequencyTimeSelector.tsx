import { useState } from "react";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DateTimeSelect from "./DateTimeSelect";

interface FrequencyTime {
  day?: number;
  time: number;
}

interface Props {
  message: string;
  onSelect(frequencyTime: FrequencyTime): void;
}

export default function FrequencyTimeSelector({ message, onSelect }: Props) {
  const { clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const [scheduleTime, setScheduleTime] = useState<FrequencyTime>({
    time: 0,
  });

  console.log({ scheduleTime });
  const selectedFrequency = clonedWorkflow?.schedule?.frequency ?? "";

  return (
    <Stack gap={4}>
      <Typography
        fontSize={16}
        fontWeight={500}
        color={"common.black"}
      >
        {message}
      </Typography>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        <Stack
          direction={"row"}
          alignItems={"flex-end"}
          gap={2}
        >
          {["Weekly", "Monthly"].includes(selectedFrequency) && (
            <DateTimeSelect
              type="date"
              onChange={day => setScheduleTime(prev => ({ ...prev, day }))}
            />
          )}
          <DateTimeSelect
            type="time"
            onChange={time => setScheduleTime(prev => ({ ...prev, time }))}
          />
        </Stack>
        <Button
          onClick={() => onSelect(scheduleTime)}
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
