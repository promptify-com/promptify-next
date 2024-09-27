import { Dispatch, useState } from "react";
import { useRouter } from "next/router";
// Mui
import { MenuItem } from "@mui/material";
// Redux
import { useAppDispatch } from "@/hooks/useStore";
import { handleClose, handleOpen } from "@/core/store/removeDialogSlice";
import { setToast } from "@/core/store/toastSlice";
// Queries
import { useDeleteWorkflowMutation } from "@/core/api/workflows";

interface Props {
  workflow_id: string;
  setOpen: Dispatch<boolean>;
}

function RemoveWorkflow({ workflow_id, setOpen }: Props) {
  // Store
  const dispatch = useAppDispatch();
  const [deleteWorkflow] = useDeleteWorkflowMutation();
  // Route
  const router = useRouter();
  ///
  const handleRemove = async () => {
    try {
      await deleteWorkflow(workflow_id);
      setOpen(false);
      dispatch(handleClose());
      if (router.pathname === "/apps/[slug]") router.push(`/apps`);
      dispatch(setToast({ message: "Workflow deleted successfully", severity: "success" }));
    } catch (err) {
      console.error("Failed to pause workflow", err);
      dispatch(setToast({ message: "Failed to delete workflow. Please try again.", severity: "error" }));
    }
  };
  const handleOpenModal = () => {
    setOpen(false);
    dispatch(
      handleOpen({
        title: "Remove AI App",
        content: "Are you sure you want to remove this AI App?",
        onSubmit: handleRemove,
      }),
    );
  };

  return (
    <>
      <MenuItem
        sx={menuItemStyle}
        onClick={handleOpenModal}
      >
        Remove AI App
      </MenuItem>
    </>
  );
}

export default RemoveWorkflow;

const menuItemStyle = {
  color: "#000",
  fontSize: "13px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "150%",
  transition: "all 0.3s ease",
  "&:hover": {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    borderRadius: "100px",
    background: "#FFE1E1",
  },
};
