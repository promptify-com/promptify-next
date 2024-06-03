import { useEffect, useState } from "react";
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
  const scheduledData = clonedWorkflow?.periodic_task?.crontab;

  const scheduleDay =
    (scheduledData?.frequency === "weekly" ? scheduledData.day_of_week : scheduledData?.day_of_month) ?? 0;
  const [scheduleTime, setScheduleTime] = useState<FrequencyTime>({
    day: ["*", "1,15"].includes(scheduleDay.toString()) ? 0 : scheduleDay,
    time: scheduledData?.hour ?? 0,
  });
  const localScheduleData = clonedWorkflow?.schedule;
  const selectedFrequency = localScheduleData?.frequency ?? scheduledData?.frequency ?? "";

  const handleChangeScheduleTime = (data: FrequencyTime) => {
    setScheduleTime(data);
    if (scheduledData) {
      onSelect(data);
    }
  };

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
          {["weekly", "monthly"].includes(selectedFrequency) && (
            <DateTimeSelect
              type="date"
              onChange={day => handleChangeScheduleTime({ ...scheduleTime, day })}
              defaultValue={scheduleTime.day}
            />
          )}
          <DateTimeSelect
            type="time"
            onChange={time => handleChangeScheduleTime({ ...scheduleTime, time })}
            defaultValue={scheduleTime.time}
          />
        </Stack>
        {!scheduledData && (
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
        )}
      </Stack>
    </Stack>
  );
}
