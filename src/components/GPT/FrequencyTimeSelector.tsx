import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
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
  const localScheduleData = clonedWorkflow?.schedule;

  const _scheduleData = localScheduleData ?? scheduledData;

  // Priority selection
  const selectedFrequency = _scheduleData?.frequency ?? "";

  const getDefaultDay = (): number => {
    if (selectedFrequency === "weekly") {
      return _scheduleData?.day_of_week === "*" ? 1 : (_scheduleData?.day_of_week as number) ?? 1; // Default to Monday
    }
    if (selectedFrequency === "monthly") {
      return _scheduleData?.day_of_month === "*" ? 1 : (_scheduleData?.day_of_month as number) ?? 1; // Default to 1st day of the month
    }
    return 1;
  };

  const getInitialTime = () => localScheduleData?.hour ?? _scheduleData?.hour ?? 0; // 12:00 AM

  const [scheduleTime, setScheduleTime] = useState<FrequencyTime>({
    day: getDefaultDay(),
    time: getInitialTime(),
  });

  // Update state when priorities change
  useEffect(() => {
    setScheduleTime({
      day: getDefaultDay(),
      time: getInitialTime(),
    });
  }, [localScheduleData, _scheduleData, selectedFrequency]);

  const handleChangeScheduleTime = (data: FrequencyTime) => {
    setScheduleTime(data);
    onSelect(data);
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
          {selectedFrequency === "weekly" && (
            <DateTimeSelect
              type="date"
              onChange={day => handleChangeScheduleTime({ ...scheduleTime, day })}
              defaultValue={scheduleTime.day}
            />
          )}
          {selectedFrequency === "monthly" && (
            <DateTimeSelect
              type="month_date"
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
