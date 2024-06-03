import { useState, memo, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Tooltip, { type TooltipProps } from "@mui/material/Tooltip";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "@/hooks/useStore";
import { initialState } from "@/core/store/chatSlice";
import type { WorkflowExecution } from "../Automation/types";
import { calculateScheduledDates, getHighestPriorityStatus, getStylesForSchedule, getStylesForStatus } from "./helpers";
import { useGetWorkflowExecutionsQuery } from "@/core/api/workflows";

// Styles
const HEADER_STYLES = {
  flexDirection: "row",
  padding: "12px 16px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
  justifyContent: "space-between",
  alignItems: "center",
};

const DAY_BOX_STYLES = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 32,
  width: 32,
  borderRadius: "50%",
  cursor: "pointer",
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
  />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "white",
    color: "#EC2525",
    border: "1px solid #EC2525",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    fontSize: 12,
    padding: "16px 20px",
    borderRadius: "8px",
  },
  [`& .MuiTooltip-arrow`]: {
    color: "white",
    marginTop: "20px",
    "&::before": {
      marginTop: "-1px",
      border: "1px solid #EC2525",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
  },
}));

const RenderHeader = memo(
  ({ setCurrentMonth, currentMonth }: { setCurrentMonth: Dispatch<SetStateAction<Date>>; currentMonth: Date }) => (
    <Stack sx={HEADER_STYLES}>
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
  ),
);

const RenderDaysOfWeek = memo(() => (
  <Grid
    container
    spacing={1}
    justifyContent="center"
    sx={{ mt: 2 }}
  >
    {WEEK_DAYS.map(day => (
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
));

const RenderCells = memo(
  ({
    currentMonth,
    scheduledDates = [],
    executions = [],
  }: {
    currentMonth: Date;
    scheduledDates: Date[];
    executions: WorkflowExecution[];
  }) => {
    const monthStart = startOfMonth(currentMonth);
    const rows = [];
    let daysInMonth = [];
    let day = startOfWeek(monthStart, { weekStartsOn: 1 });

    while (day <= endOfMonth(currentMonth)) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const isCurrentMonth = isSameMonth(day, monthStart);
        const executionsForDay = executions.filter(exec => isSameDay(parseISO(exec.startedAt), day));
        const isScheduled = scheduledDates.some(scheduledDate => isSameDay(scheduledDate, day));
        const highestPriorityStatus = getHighestPriorityStatus(executionsForDay);

        const { backgroundColor, color } = highestPriorityStatus
          ? getStylesForStatus(highestPriorityStatus)
          : getStylesForSchedule(isScheduled, day);

        const cellContent = (
          <Box sx={{ ...DAY_BOX_STYLES, backgroundColor }}>
            <Typography
              fontSize={"12px"}
              sx={{ color: !isCurrentMonth ? "text.disabled" : color }}
            >
              {formattedDate}
            </Typography>
          </Box>
        );

        daysInMonth.push(
          <Grid
            key={day.toString()}
            item
            xs
            mb={"10px"}
          >
            {executionsForDay.some(exec => exec.status === "failed") ? (
              <CustomTooltip
                placement="top"
                title={executionsForDay.find(exec => exec.status === "failed")?.error || ""}
                arrow
              >
                {cellContent}
              </CustomTooltip>
            ) : (
              cellContent
            )}
          </Grid>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid
          container
          spacing={1}
          ml={"0px"}
          key={day.toString()}
        >
          {daysInMonth}
        </Grid>,
      );
      daysInMonth = [];
    }

    return <Box sx={{ mt: 2 }}>{rows}</Box>;
  },
);

function DatePickerCalendar() {
  const clonedWorkflow = useAppSelector(store => store.chat?.clonedWorkflow ?? initialState.clonedWorkflow);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [scheduledDates, setScheduledDates] = useState<Date[]>([]);
  const { data: executions } = useGetWorkflowExecutionsQuery(clonedWorkflow?.id!, {
    skip: !clonedWorkflow?.id,
  });

  useEffect(() => {
    if (clonedWorkflow?.schedule) {
      const dates = calculateScheduledDates(clonedWorkflow.schedule, startOfMonth(currentMonth));
      setScheduledDates(dates);
    }
  }, [clonedWorkflow, currentMonth]);

  return (
    <Stack
      width={"425px"}
      sx={{ border: "1px solid rgba(0, 0, 0, 0.08)", borderRadius: "16px", bgcolor: "white" }}
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
      <RenderHeader
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
      <Stack
        p={"8px"}
        mb={"16px"}
      >
        <RenderDaysOfWeek />
        <RenderCells
          scheduledDates={scheduledDates}
          currentMonth={currentMonth}
          executions={executions?.data ?? []}
        />
      </Stack>
    </Stack>
  );
}

export default memo(DatePickerCalendar);
