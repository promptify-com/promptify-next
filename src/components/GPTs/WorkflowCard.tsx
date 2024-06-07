import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import Chip from "@mui/material/Chip";

import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch } from "@/hooks/useStore";
import {
  useDeleteWorkflowMutation,
  useDislikeWorkflowMutation,
  useLikeWorkflowMutation,
  usePauseWorkflowMutation,
  useResumeWorkflowMutation,
} from "@/core/api/workflows";
import { TIMES } from "@/components/GPT/Constants";
import { GearIcon } from "@/assets/icons/GearIcon";
import useTruncate from "@/hooks/useTruncate";
import Image from "@/components/design-system/Image";
import StatusChip from "@/components/GPTs/StatusChip";
import BoltOutlined from "@/components/GPTs/Icons/BoltOutlined";
import { capitalizeString, formatDate } from "@/common/helpers";
import { DeleteDialog } from "../dialog/DeleteDialog";
import WorkflowActionsModal from "./WorkflowActionsModal";
import type { ITemplateWorkflow, IWorkflowSchedule } from "../Automation/types";

interface Props {
  templateWorkflow?: ITemplateWorkflow;
  periodic_task?: null | {
    task: string;
    name: string;
    enabled: boolean;
    crontab: IWorkflowSchedule;
  };
  userWorkflowId?: string;
  lastExecuted: Date | null;
}

function WorkflowCard({ templateWorkflow, periodic_task, userWorkflowId, lastExecuted }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { truncate } = useTruncate();

  const [deleteWorkflow] = useDeleteWorkflowMutation();
  const [likeWorklow] = useLikeWorkflowMutation();
  const [dislikeWorkflow] = useDislikeWorkflowMutation();

  const [pauseWorkflow] = usePauseWorkflowMutation();
  const [resumeWorkflow] = useResumeWorkflowMutation();
  const [selectedWorkflow, setSelectedWorkflow] = useState<ITemplateWorkflow>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(!periodic_task?.enabled);
  const actionsAnchorRef = useRef<HTMLButtonElement>(null);

  const frequency = capitalizeString(periodic_task?.crontab.frequency ?? "");
  const time = TIMES[periodic_task?.crontab.hour ?? 0];

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isModalOpen) {
      setSelectedWorkflow(undefined);
      setIsModalOpen(false);
      return;
    }
    setSelectedWorkflow(templateWorkflow);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!userWorkflowId) {
    }
    try {
      await deleteWorkflow(String(userWorkflowId));
      setSelectedWorkflow(undefined);
      setOpenDeleteDialog(false);

      dispatch(setToast({ message: "Workflow deleted successfully", severity: "success" }));
    } catch (err) {
      console.error("Failed to delete workflow", err);
      dispatch(setToast({ message: "Failed to delete workflow. Please try again.", severity: "error" }));
    }
  };

  const handleEdit = () => {
    router.push(`/gpts/${templateWorkflow?.slug}`);
    handleCloseModal();
  };

  const handlePause = async () => {
    if (!userWorkflowId) return;

    try {
      await pauseWorkflow(userWorkflowId);
      setIsPaused(true);
      dispatch(setToast({ message: "Workflow paused successfully", severity: "success" }));
    } catch (err) {
      console.error("Failed to pause workflow", err);
      dispatch(setToast({ message: "Failed to pause workflow. Please try again.", severity: "error" }));
    }
    handleCloseModal();
  };

  const handleResume = async () => {
    if (!userWorkflowId) return;

    try {
      await resumeWorkflow(userWorkflowId);
      setIsPaused(false);
      dispatch(setToast({ message: "Workflow resumed successfully", severity: "success" }));
    } catch (err) {
      console.error("Failed to resume workflow", err);
      dispatch(setToast({ message: "Failed to resume workflow. Please try again.", severity: "error" }));
    }
    handleCloseModal();
  };

  const handleRemove = () => {
    setOpenDeleteDialog(true);
    handleCloseModal();
  };

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

  return (
    <>
      <Link
        href={`/gpts/${templateWorkflow?.slug}`}
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
                {templateWorkflow?.activities?.favorites_count ?? 0}
              </Stack>
            </Stack>
          </Box>
          {periodic_task && templateWorkflow?.is_schedulable && (
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
                minHeight={"51px"}
                maxWidth={"180px"}
              >
                {truncate(templateWorkflow?.description || "", { length: 70 })}
              </Typography>
              {!periodic_task && lastExecuted && (
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
            {periodic_task && templateWorkflow?.is_schedulable ? (
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
                  Scheduled: {frequency} @ {time}
                </Typography>

                <Box
                  ref={actionsAnchorRef}
                  onClick={handleOpenModal}
                  sx={{
                    display: "flex",
                    width: "32px",
                    height: "32px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "100px",
                    border: "1px solid rgba(0, 0, 0, 0.10)",
                    background: "#FFF",
                  }}
                >
                  <GearIcon />
                </Box>
              </Stack>
            ) : (
              <Chip
                label={"Productivity"}
                size="small"
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

      {isModalOpen && (
        <WorkflowActionsModal
          open={isModalOpen}
          workflow={selectedWorkflow}
          onClose={handleCloseModal}
          onEdit={handleEdit}
          onPause={handlePause}
          onResume={handleResume}
          onRemove={handleRemove}
          anchorEl={actionsAnchorRef.current}
          isPaused={isPaused}
        />
      )}
      {openDeleteDialog && (
        <DeleteDialog
          open={true}
          dialogContentText={`Are you sure you want to remove the "${selectedWorkflow?.name}"?`}
          onClose={() => setOpenDeleteDialog(false)}
          onSubmit={handleDelete}
        />
      )}
    </>
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
