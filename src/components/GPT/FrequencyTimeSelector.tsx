import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DateTimeSelect from "./DateTimeSelect";
import type { FrequencyTime } from "@/components/Automation/types";

interface Props {
  message: string;
  onSelect(frequencyTime: FrequencyTime): void;
}

export default function FrequencyTimeSelector({ message, onSelect }: Props) {
  const [selectedFrequency, setSelectedFrequency] = useState("");

  const { clonedWorkflow } = useAppSelector(state => state.chat ?? initialChatState);
  const scheduledData = clonedWorkflow?.periodic_task?.crontab;

  const scheduleDayOfWeek = scheduledData?.frequency === "weekly" ? scheduledData.day_of_week : 0;
  const scheduleDayOfMonth = scheduledData?.frequency === "monthly" ? scheduledData?.day_of_month : 1;
  const [scheduleTime, setScheduleTime] = useState<FrequencyTime>({
    day_of_week: scheduleDayOfWeek,
    day_of_month: scheduleDayOfMonth,
    time: scheduledData?.hour ?? 0,
  });
  const localScheduleData = clonedWorkflow?.schedule;

  useEffect(() => {
    setSelectedFrequency(localScheduleData?.frequency ?? scheduledData?.frequency ?? "");
  }, [localScheduleData, scheduledData]);

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
