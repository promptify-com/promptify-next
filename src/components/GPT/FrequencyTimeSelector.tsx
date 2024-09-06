import { useEffect, useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import DateTimeSelect from "./DateTimeSelect";
import type { FrequencyTime } from "@/components/Automation/types";

interface Props {
  message: string;
  onSelect(frequencyTime: FrequencyTime): void;
}

export default function FrequencyTimeSelector({ message, onSelect }: Props) {
  const clonedWorkflow = useAppSelector(state => state.chat?.clonedWorkflow ?? initialChatState.clonedWorkflow);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const scheduledData = useMemo(() => {
    return (
      clonedWorkflow?.schedule ??  clonedWorkflow?.periodic_task?.crontab
      
    );
  }, [clonedWorkflow]);

  const scheduleDayOfWeek =
    scheduledData?.frequency === "weekly" && !(["0-6", "*"].includes(scheduledData.day_of_week?.toString() || ""))
      ? scheduledData?.day_of_week
      : 0;

  const scheduleDayOfMonth =
    scheduledData?.frequency === "monthly" && !(["1,15", "*"].includes(scheduledData.day_of_month?.toString() || ""))
      ? scheduledData?.day_of_month
      : 1;

  const scheduleHour = scheduledData?.hour && !(["0","*"].includes(scheduledData?.hour?.toString() || "")) ? scheduledData?.hour : 9
  // default for 9AM

  const [scheduleTime, setScheduleTime] = useState<FrequencyTime>({
    day_of_week: scheduleDayOfWeek, // default of monday
    day_of_month: scheduleDayOfMonth, // default of the first month
    time: scheduleHour,
  });

  useEffect(() => {
    setSelectedFrequency(scheduledData?.frequency ?? "");
  }, [clonedWorkflow]);

  useEffect(() => {
    setScheduleTime({
      ...scheduleTime,
      day_of_month: scheduleDayOfMonth,
      day_of_week: scheduleDayOfWeek,
      time: scheduleHour
    });
  }, [scheduledData?.frequency]); // to sync the changes with scheduleTime state

  useEffect(() => {
    setScheduleTime({
      ...scheduleTime,
      day_of_month: scheduleDayOfMonth,
      day_of_week: scheduleDayOfWeek,
      time: scheduleHour
    });
  }, [scheduledData?.frequency]); // to sync the changes with scheduleTime state

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
          {selectedFrequency === "weekly" && (
            <DateTimeSelect
              type="date"
              onChange={day_of_week => handleChangeScheduleTime({ ...scheduleTime, day_of_week })}
              defaultValue={scheduleTime.day_of_week as number}
            />
          )}
          {selectedFrequency === "monthly" && (
            <DateTimeSelect
              type="month_date"
              onChange={day_of_month => handleChangeScheduleTime({ ...scheduleTime, day_of_month })}
              defaultValue={scheduleTime.day_of_month as number}
            />
          )}
          <DateTimeSelect
            type="time"
            onChange={time => handleChangeScheduleTime({ ...scheduleTime, time })}
            defaultValue={scheduleTime.time}
          />
        </Stack>
        {!clonedWorkflow?.periodic_task && (
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
