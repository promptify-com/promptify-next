import { useState } from "react";
import Link from "next/link";
// Mui
import { Stack, Box, Typography, Chip } from "@mui/material";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import BoltOutlined from "@/components/GPTs/Icons/BoltOutlined";
// Store
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { useDislikeWorkflowMutation, useGetWorkflowByIdQuery, useLikeWorkflowMutation } from "@/core/api/workflows";
//
import { TIMES } from "@/components/GPT/Constants";
import StatusChip from "@/components/GPTs/StatusChip";
import useTruncate from "@/hooks/useTruncate";
import Image from "@/components/design-system/Image";
import { capitalizeString, formatDate } from "@/common/helpers";
import type { ITemplateWorkflow, IPeriodicTask } from "../../Automation/types";
// Components
import WorkflowCardActions from "./WorkflowCardActions";
import WorkflowCardPlaceholder from "@/components/GPTs/WorkflowCard/skeleton";

interface Props {
  templateWorkflow?: ITemplateWorkflow;
  periodic_task?: IPeriodicTask | null;
  userWorkflowId?: string;
  lastExecuted: string | null;
  isGPTScheduled?: boolean;
  category?: string;
}

function WorkflowCard({
  templateWorkflow,
  periodic_task,
  userWorkflowId,
  lastExecuted,
  isGPTScheduled = false,
  category,
}: Props) {
  const dispatch = useAppDispatch();
  const { truncate } = useTruncate();
  //
  const [likeWorklow] = useLikeWorkflowMutation();
  const [dislikeWorkflow] = useDislikeWorkflowMutation();
  const [isPaused, setIsPaused] = useState(!periodic_task?.enabled);
  const frequency = capitalizeString(periodic_task?.frequency ?? "");
  const time = TIMES[periodic_task?.crontab.hour ?? 0];
  // Query
  const { data, isLoading } = useGetWorkflowByIdQuery(templateWorkflow?.id ?? 0);
  //
  const handleLikeDislike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!templateWorkflow?.id) {
      return;
    }

    const _id = templateWorkflow.id;

    try {
      if (templateWorkflow?.is_liked) {
        await dislikeWorkflow(_id);
        dispatch(setToast({ message: `You unlike ${templateWorkflow.name}`, severity: "success" }));
        return;
      }
      await likeWorklow(_id);
      dispatch(setToast({ message: `You liked ${templateWorkflow?.name}`, severity: "success" }));
    } catch (error) {
      dispatch(setToast({ message: "Something went wrong, please try again later!", severity: "error" }));
    }
  };
  //
  if (isLoading) return <WorkflowCardPlaceholder />;

  return (
    <Stack sx={{ position: "relative" }}>
      <Link
        href={`/apps/${templateWorkflow?.slug}`}
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
              src={templateWorkflow?.image ?? ""}
              fill
              alt={templateWorkflow?.name ?? "workflow"}
              style={{ objectFit: "cover" }}
            />
            <Stack
              direction={"row"}
              gap={"8px"}
              position={"absolute"}
              bottom={7}
              right={10}
            >
              <Stack
                onClick={handleLikeDislike}
                direction={"row"}
                alignItems={"center"}
                gap={0.5}
                sx={{
                  ...iconTextStyle,
                  bgcolor: templateWorkflow?.is_liked ? "red" : "rgba(0, 0, 0, 0.8)",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    bgcolor: templateWorkflow?.is_liked ? "rgba(0, 0, 0, 0.8)" : "red",
                  },
                }}
                className="icon-text-style"
              >
                <FavoriteBorderOutlined sx={{ fontSize: 12 }} />
                {templateWorkflow?.likes ?? 0}
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={0.5}
                sx={{ ...iconTextStyle, bgcolor: "rgba(0, 0, 0, 0.8)" }}
                className="icon-text-style"
              >
                <BoltOutlined
                  size="12"
                  color="#ffffff"
                />
                {templateWorkflow?.execution_count ?? 0}
              </Stack>
            </Stack>
          </Box>
          {isGPTScheduled && (
            <Stack
              position={"absolute"}
              top={{ xs: "24px", md: "16px" }}
              right={{ xs: "24px", md: "16px" }}
            >
              <StatusChip status={!isPaused ? "active" : "paused"} />
            </Stack>
          )}
          <Stack
            p={{ xs: "16px", md: `${!periodic_task ? "16px 24px" : "40px 10px 16px 24px"}` }}
            flex={1}
            gap={"24px"}
            alignItems={"start"}
            justifyContent={"space-between"}
          >
            <Stack gap={"8px"}>
              <Typography
                fontSize={"16px"}
                fontWeight={500}
                color={"#000"}
                lineHeight={"120%"}
              >
                {templateWorkflow?.name ?? ""}
              </Typography>
              <Typography
                fontSize={11}
                fontWeight={400}
                lineHeight={"150%"}
                color={"#000"}
                maxWidth={"180px"}
              >
                {truncate(templateWorkflow?.description || "", { length: 70 })}
              </Typography>
              {!isGPTScheduled && lastExecuted && (
                <Typography
                  fontSize={11}
                  fontWeight={500}
                  lineHeight={"150%"}
                  color={"#000"}
                  minHeight={{ xs: 0, md: "17px" }}
                >
                  last used: <span>{formatDate(lastExecuted)}</span>
                </Typography>
              )}
            </Stack>
            {isGPTScheduled ? (
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
              >
                <Typography
                  fontSize={11}
                  fontWeight={400}
                  lineHeight={"150%"}
                  color={"#000"}
                >
                  Scheduled: {frequency} {periodic_task?.frequency !== "hourly" ? "@" : ""} {time}
                </Typography>
              </Stack>
            ) : (
              <Chip
                label={templateWorkflow?.category?.name ?? category}
                size={"small"}
                sx={{
                  fontSize: "11px",
                  fontWeight: 500,
                  lineHeight: "16px",
                  textAlign: "left",
                  padding: "7px 12px 7px 12px",
                  borderRadius: "100px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  bgcolor: "white",
                  "& .MuiChip-label": {
                    p: "10px",
                  },
                }}
              />
            )}
          </Stack>
        </Stack>
      </Link>
      {isGPTScheduled && (
        <WorkflowCardActions
          workflow={data}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          userWorkflowId={userWorkflowId}
          sx={{ position: "absolute", right: 10, bottom: 10 }}
        />
      )}
    </Stack>
  );
}

const iconTextStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "white",
  borderRadius: "100px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  padding: "0px 12px",
  height: "26px",
  svg: {
    fontSize: 12,
  },
};

export default WorkflowCard;
