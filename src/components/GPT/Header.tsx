import Stack from "@mui/material/Stack";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material";
import { theme } from "@/theme";
import Image from "@/components/design-system/Image";
import { ElectricBoltIcon } from "@/assets/icons/ElectricBoltIcon";
import type { ITemplateWorkflow } from "@/components/Automation/types";
import lazy from "next/dynamic";
import { useAppSelector } from "@/hooks/useStore";
import { initialState } from "@/core/store/chatSlice";
import { capitalizeString } from "@/common/helpers";
import { DAYS, TIMES } from "./Constants";
import StatusChip from "@/components/GPTs/StatusChip";

const LazyDateCPickerCalendar = lazy(() => import("@/components/GPTs/DatePickerCalendar"));

interface Props {
  workflow: ITemplateWorkflow;
}

export default function Header({ workflow }: Props) {
  const clonedWorkflow = useAppSelector(store => store.chat?.clonedWorkflow ?? initialState.clonedWorkflow);
  const periodicTask = clonedWorkflow?.periodic_task;
  const scheduleData = clonedWorkflow?.periodic_task?.crontab;

  const frequency = capitalizeString(periodicTask?.frequency ?? "");
  const isWeekly = scheduleData?.frequency === "weekly";
  const scheduleDay = isWeekly ? scheduleData?.day_of_week : scheduleData?.day_of_month;
  const day =
    (scheduleDay && scheduleDay.toString() !== "*" && (isWeekly ? DAYS[scheduleDay as number] : scheduleDay)) || null;
  const time = TIMES[scheduleData?.hour ?? 0];

  const formattedDay = day ? `on ${isNaN(Number(day)) ? day : `day ${day}`}` : "";
  const isActive = periodicTask?.enabled;

  return (
    <Stack
      direction={{ md: "row" }}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={"48px"}
      sx={{
        p: { xs: "16px", md: "64px 48px" },
        borderBottom: "1px solid #ECECF3",
        background: "linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0%, rgba(110, 69, 233, 0.05) 100%), #FFF;",
      }}
    >
      <Stack
        gap={6}
        width={{ md: "50%" }}
      >
        <Stack
          height={{ xs: "120px", sm: "140px" }}
          width={{ xs: "120px", sm: "140px" }}
          borderRadius={"24px"}
          bgcolor={"white"}
          border={"1px solid"}
          borderColor={"surfaceContainerHigh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CardMedia
            sx={{
              width: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 },
              borderRadius: "16px",
            }}
          >
            <Image
              src={workflow.image ?? require("@/assets/images/default-thumbnail.jpg")}
              alt={workflow.name}
              style={{
                borderRadius: "16px",
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
              priority={true}
            />
          </CardMedia>
        </Stack>
        <Stack gap={3}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={0.5}
            sx={{
              width: "fit-content",
              bgcolor: "common.black",
              borderRadius: "99px",
              p: "6px 16px 6px 8px",
              fontSize: 12,
              fontWeight: 500,
              color: "common.white",
            }}
          >
            <ElectricBoltIcon
              color="#FFF"
              small
            />
            AI App
          </Stack>
          <Typography
            fontSize={{ xs: 33, md: 40 }}
            fontWeight={500}
            color={"onSurface"}
          >
            {workflow.name}
          </Typography>
          <Typography
            fontSize={{ xs: 14, md: 16 }}
            fontWeight={400}
            lineHeight={"19.2px"}
            color={"onSurface"}
          >
            {workflow.description}
          </Typography>
          {workflow.is_schedulable && periodicTask?.name && (
            <>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={2}
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "onSurface",
                }}
              >
                Status:
                <StatusChip status={isActive ? "active" : "paused"} />
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={2}
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: alpha(theme.palette.onSurface, 0.5),
                }}
              >
                Scheduled: {frequency} {formattedDay} @ {time}
                {/* <IconButton>
                  <SettingsOutlined />
                </IconButton> */}
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
      {workflow.is_schedulable && periodicTask?.task && <LazyDateCPickerCalendar />}
    </Stack>
  );
}
