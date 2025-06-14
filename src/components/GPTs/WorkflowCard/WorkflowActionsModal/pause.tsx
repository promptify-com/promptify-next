import type { Dispatch } from "react";
import { MenuItem } from "@mui/material";
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import { usePauseWorkflowMutation } from "@/core/api/workflows";

interface Props {
  workflow_id: string;
  setOpen: Dispatch<boolean>;
  setIsPaused: Dispatch<boolean>;
}

function PauseWorkflow({ workflow_id, setOpen, setIsPaused }: Props) {
  const dispatch = useAppDispatch();
  const [pauseWorkflow] = usePauseWorkflowMutation();
  const handlePause = async () => {
    try {
      await pauseWorkflow(workflow_id);
      setOpen(false);
      setIsPaused(true);
      dispatch(setToast({ message: "Workflow paused successfully", severity: "success" }));
    } catch (err) {
      console.error("Failed to pause workflow", err);
      dispatch(setToast({ message: "Failed to pause workflow. Please try again.", severity: "error" }));
    }
  };

  return (
    <MenuItem
      sx={menuItemStyle}
      onClick={handlePause}
    >
      Pause AI App
    </MenuItem>
  );
}

export default PauseWorkflow;

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
