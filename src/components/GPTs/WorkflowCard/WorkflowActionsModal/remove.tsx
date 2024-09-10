import { Dispatch } from "react";
// Mui
import { MenuItem } from "@mui/material";
// Redux
import { useAppDispatch } from "@/hooks/useStore";
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
  ///
  const handleRemove = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteWorkflow(workflow_id);
      setOpen(false);
      dispatch(setToast({ message: "Workflow deleted successfully", severity: "success" }));
    } catch (err) {
      console.error("Failed to pause workflow", err);
      dispatch(setToast({ message: "Failed to delete workflow. Please try again.", severity: "error" }));
    }
  };

  return (
    <MenuItem
      sx={menuItemStyle}
      onClick={handleRemove}
    >
      Remove AI App
    </MenuItem>
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
