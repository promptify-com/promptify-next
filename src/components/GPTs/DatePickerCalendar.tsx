// src/DatePickerCalendar.tsx
import { useState } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { useGetWorkflowExecutionsQuery } from "@/core/api/workflows";
import type { WorkflowExecution } from "@/components/Automation/types";

function DatePickerCalendar({ workflowId }: { workflowId: string }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // const { data: executions } = useGetWorkflowExecutionsQuery(workflowId);

  const executions: { data: WorkflowExecution[]; nextCursor: string | null } = {
    data: [
      {
        id: "13754",
        finished: true,
        mode: "webhook",
        retryOf: null,
        retrySuccessId: null,
        status: "success",
        startedAt: "2024-05-24T16:13:13.626Z",
        stoppedAt: "2024-05-24T16:13:17.122Z",
        workflowId: "LkQGmazWmp1WMFmg",
        waitTill: null,
      },
      {
        id: "13751",
        finished: true,
        mode: "webhook",
        retryOf: null,
        retrySuccessId: null,
        status: "success",
        startedAt: "2024-05-24T16:12:19.279Z",
        stoppedAt: "2024-05-24T16:12:22.494Z",
        workflowId: "LkQGmazWmp1WMFmg",
        waitTill: null,
      },
    ],
    nextCursor: null,
  };

  const renderHeader = () => {
    return (
      <Stack
        direction={"row"}
        padding={"12px 16px"}
        borderBottom={"1px solid rgba(0, 0, 0, 0.08)"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <KeyboardArrowLeft />
        </IconButton>
        <Typography
          fontSize={16}
          lineHeight={"150%"}
          fontWeight={"500"}
        >
          {format(currentMonth, "MMMM, yyyy")}
        </Typography>
        <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <KeyboardArrowRight />
        </IconButton>
      </Stack>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return (
      <Grid
        container
        spacing={1}
        justifyContent="center"
        sx={{ mt: 2 }}
      >
        {daysOfWeek.map(day => (
          <Grid
            item
            xs
            key={day}
          >
            <Typography
              fontSize={10}
              fontWeight={700}
              lineHeight={"180%"}
              textTransform={"uppercase"}
              align="center"
              color={"#8F8F8F"}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });

    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const rows = [];
    let daysInMonth = [];
    let day = startOfWeek(monthStart, { weekStartsOn: 1 });
    let formattedDate = "";

    const executionDates = executions?.data.map(execution => parseISO(execution.startedAt)) ?? [];

    while (day <= endOfMonth(currentMonth)) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const isCurrentMonth = isSameMonth(day, monthStart);
        const hasExecution = executionDates.some(execDate => isSameDay(execDate, day));

        daysInMonth.push(
          <Grid
            key={day.toString()}
            item
            xs
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                width: 40,
                borderRadius: "50%",
                cursor: "pointer",
                backgroundColor: hasExecution ? "#F4F1FF" : "transparent",
              }}
            >
              <Typography
                fontSize={"12px"}
                sx={{
                  color: !isCurrentMonth ? "#8F8F8F" : hasExecution ? "#6E45E9" : "text.primary",
                }}
              >
                {formattedDate}
              </Typography>
            </Box>
          </Grid>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid
          container
          spacing={1}
          ml={"-3px"}
          key={day.toString()}
        >
          {daysInMonth}
        </Grid>,
      );
      daysInMonth = [];
    }
    return <Box sx={{ mt: 2 }}>{rows}</Box>;
  };

  return (
    <Stack
      width={"425px"}
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "16px",
      }}
    >
      <Stack
        borderBottom={"1px solid rgba(0, 0, 0, 0.08)"}
        p={"24px"}
        textAlign={"center"}
      >
        <Typography
          fontSize={14}
          fontWeight={600}
          lineHeight={"100%"}
        >
          Current Schedule
        </Typography>
      </Stack>
      {renderHeader()}
      <Stack p={"8px"}>
        {renderDaysOfWeek()}
        {renderCells()}
      </Stack>
    </Stack>
  );
}

export default DatePickerCalendar;
