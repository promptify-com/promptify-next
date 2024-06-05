import { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import Image from "@/components/design-system/Image";
import StatusChip from "@/components/GPTs/StatusChip";
import BoltOutlined from "@/components/GPTs/Icons/BoltOutlined";
import Link from "next/link";
import { IWorkflow, IWorkflowSchedule } from "../Automation/types";
import useTruncate from "@/hooks/useTruncate";
import { capitalizeString } from "@/common/helpers";
import { TIMES } from "../GPT/Constants";
import Chip from "@mui/material/Chip";
import { useDeleteWorkflowMutation, useDislikeWorkflowMutation, useLikeWorkflowMutation } from "@/core/api/workflows";
import { DeleteDialog } from "../dialog/DeleteDialog";
import { GearIcon } from "@/assets/icons/GearIcon";
import WorkflowActionsModal from "./WorkflowActionsModal";
import { useRouter } from "next/router";
import { setToast } from "@/core/store/toastSlice";
import { useAppDispatch } from "@/hooks/useStore";

interface Props {
  workflow?: IWorkflow;
  periodic_task?: null | {
    task: string;
    name: string;
    enabled: boolean;
    crontab: IWorkflowSchedule;
  };
  workflowId?: string | number;
}

function WorkflowCard({ workflow, periodic_task, workflowId }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { truncate } = useTruncate();

  const [deleteWorkflow] = useDeleteWorkflowMutation();
  const [likeWorklow] = useLikeWorkflowMutation();
  const [dislikeWorkflow] = useDislikeWorkflowMutation();

  const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflow>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
    setSelectedWorkflow(workflow);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!workflowId) return;

    try {
      await deleteWorkflow(workflowId as string);
      setSelectedWorkflow(undefined);
      setOpenDeleteDialog(false);

      dispatch(setToast({ message: "Workflow deleted successfully", severity: "success" }));
    } catch (err) {
      console.error("Failed to delete workflow", err);
      dispatch(setToast({ message: "Failed to delete workflow. Please try again.", severity: "error" }));
    }
  };

  const handleEdit = () => {
    router.push(`/gpts/${workflow?.slug}`);
    handleCloseModal();
  };

  const handlePause = () => {
    // Handle the pause action
    handleCloseModal();
  };

  const handleRemove = () => {
    setOpenDeleteDialog(true);
    handleCloseModal();
  };

  const handleLikeDislike = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!workflowId) {
      return;
    }

    if (workflow?.is_liked) {
      dislikeWorkflow(workflowId);
      return;
    }
    likeWorklow(workflowId);
  };

  return (
    <>
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
              alt={workflow?.name ?? "workflow"}
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
                sx={{ ...iconTextStyle, bgcolor: workflow?.is_liked ? "red" : "rgba(0, 0, 0, 0.8)" }}
                className="icon-text-style"
              >
                <FavoriteBorderOutlined sx={{ fontSize: 12 }} />
                {workflow?.likes ?? 0}
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
                {workflow?.activities?.favorites_count ?? 0}
              </Stack>
            </Stack>
          </Box>
          {periodic_task && workflow?.is_schedulable && (
            <Stack
              position={"absolute"}
              top={{ xs: "24px", md: 7 }}
              right={{ xs: "24px", md: 7 }}
            >
              <StatusChip status={periodic_task?.enabled ? "active" : "paused"} />
            </Stack>
          )}
          <Stack
            p={{ xs: "16px", md: "40px 24px 16px 24px" }}
            flex={1}
            gap={"24px"}
            alignItems={"start"}
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
            {periodic_task && workflow?.is_schedulable ? (
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
          onRemove={handleRemove}
          anchorEl={actionsAnchorRef.current}
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
