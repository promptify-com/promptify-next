import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";

import Image from "@/components/design-system/Image/";
import StatusChip from "@/components/GPTs/StatusChip";
import BoltOutlined from "@/components/GPTs/Icons/BoltOutlined";
import Link from "next/link";
import { IWorkflow } from "../Automation/types";
import useTruncate from "@/hooks/useTruncate";
import { capitalizeString } from "@/common/helpers";
import { TIMES } from "../GPT/Constants";

interface Props {
  index: number;
  workflow?: IWorkflow;
}
function WorkflowCard({ index, workflow }: Props) {
  const { truncate } = useTruncate();

  const scheduleData = workflow?.periodic_task;
  const frequency = capitalizeString(scheduleData?.crontab.frequency ?? "");
  const time = TIMES[scheduleData?.crontab.hour ?? 0];
  return (
    <Link
      href={`/gpts/${workflow?.slug}`}
      style={{ textDecoration: "none" }}
    >
      <Stack
        flex={1}
        p={"8px"}
        width={{ xs: "282px", md: "487px" }}
        minWidth={{ xs: "282px", md: "487px" }}
        direction={{ xs: "column", md: "row" }}
        bgcolor={"#F9F9F9"}
        borderRadius={"16px"}
        position={"relative"}
      >
        <Box
          width={{ xs: "100%", md: "180px" }}
          height={{ xs: "266px", md: "180px" }}
          borderRadius={"18px"}
          overflow={"hidden"}
          position={"relative"}
        >
          <Image
            src={workflow?.image ?? ""}
            fill
            alt=""
          />
          <Stack
            direction={"row"}
            gap={"8px"}
            position={"absolute"}
            bottom={7}
            right={10}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={0.5}
              sx={iconTextStyle}
              className="icon-text-style"
            >
              <FavoriteBorderOutlined sx={{ fontSize: 12 }} />
              {workflow?.activities?.likes_count ?? 0}
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={0.5}
              sx={iconTextStyle}
              className="icon-text-style"
            >
              <BoltOutlined
                size="12"
                color="#ffffff"
              />
              {workflow?.activities?.favorites_count ?? 0}
            </Stack>
          </Stack>
        </Box>
        {/* <Stack
          position={"absolute"}
          top={{ xs: "24px", md: 7 }}
          right={{ xs: "24px", md: 7 }}
        >
          <StatusChip status={index === 2 ? "active" : "paused"} />
        </Stack> */}
        <Stack
          p={{ xs: "16px", md: "40px 24px 16px 24px" }}
          flex={1}
          gap={"24px"}
        >
          <Stack gap={"8px"}>
            <Typography
              fontSize={"16px"}
              fontWeight={500}
              color={"#000"}
              lineHeight={"120%"}
            >
              {workflow?.name ?? ""}
            </Typography>
            <Typography
              fontSize={11}
              fontWeight={400}
              lineHeight={"150%"}
              color={"#000"}
            >
              {truncate(workflow?.description || "", { length: 70 })}
            </Typography>
          </Stack>
          {scheduleData && scheduleData.enabled && (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography
                fontSize={11}
                fontWeight={400}
                lineHeight={"150%"}
                color={"#000"}
              >
                Scheduled: {frequency} @ {time}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Link>
  );
}

const iconTextStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "white",
  bgcolor: "rgba(0, 0, 0, 0.8)",
  borderRadius: "100px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  padding: "0px 12px",
  height: "26px",
  svg: {
    fontSize: 12,
  },
};

export default WorkflowCard;
