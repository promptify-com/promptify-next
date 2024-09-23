import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import DateTimeSelect from "@/components/GPT/DateTimeSelect";
import type { FrequencyTime, FrequencyType } from "@/components/Automation/types";

interface Props {
  message: string;
  onSelect(frequencyTime: FrequencyTime): void;
  selectedFrequency?: FrequencyType;
}

export default function FrequencyTimeSelector({ message, onSelect, selectedFrequency }: Props) {
  const clonedWorkflow = useAppSelector(state => state.chat?.clonedWorkflow ?? initialChatState.clonedWorkflow);

  const scheduledData = clonedWorkflow?.schedule;

  const getDefaultValues = () => {
    const isMonthlyFrequency = selectedFrequency === "monthly";

    const dayOfWeek =
      selectedFrequency === "weekly" && !["0-6", "*"].includes(scheduledData?.day_of_week?.toString() || "")
        ? scheduledData?.day_of_week
        : 0;

    const dayOfMonth = isMonthlyFrequency && scheduledData?.day_of_month == null ? 1 : scheduledData?.day_of_month || 1; // Default to 1st of the month if null

    const hour =
      scheduledData?.hour && !["*"].includes(scheduledData?.hour?.toString() || "") ? scheduledData?.hour : 9; // Default to 9 AM

    return { day_of_week: dayOfWeek, day_of_month: dayOfMonth, time: hour };
  };

  const [scheduleTime, setScheduleTime] = useState<FrequencyTime>(getDefaultValues());

  useEffect(() => {
    setScheduleTime(getDefaultValues());
  }, [scheduledData, selectedFrequency]);

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
        {!clonedWorkflow?.schedule && (
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
