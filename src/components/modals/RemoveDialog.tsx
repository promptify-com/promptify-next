import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { red } from "@mui/material/colors/";
import { useState } from "react";
import { setToast } from "@/core/store/toastSlice";
import { useDeleteWorkflowMutation } from "@/core/api/workflows";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/useStore";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  userWorkflowId: string;
}
function DeleteDialog({ open, setOpen, userWorkflowId }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [deleteWorkflow] = useDeleteWorkflowMutation();
  const router = useRouter();

  const handleRemove = async () => {
    setLoading(true);
    try {
      await deleteWorkflow(userWorkflowId);
      setOpen(false);
      setLoading(false);
      if (router.pathname === "/apps/[slug]") router.push(`/apps`);
      dispatch(setToast({ message: "Workflow deleted successfully", severity: "success" }));
    } catch (err) {
      setLoading(false);
      console.error("Failed to pause workflow", err);
      dispatch(setToast({ message: "Failed to delete workflow. Please try again.", severity: "error" }));
    }
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
    >
      <DialogTitle fontSize={26}>Remove AI App</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to remove this AI App?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ "&:hover": { background: "#5a58cb24" } }}
          onClick={handleCloseDialog}
        >
          Cancel
        </Button>
        <Button
          onClick={handleRemove}
          sx={{
            bgcolor: red[400],
            color: "white",
            minWidth: "90px",
            "&:hover": { bgcolor: red[700] },
          }}
          disabled={loading ?? false}
        >
          {loading ?? false ? <CircularProgress size={20} /> : <span>Confirm</span>}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
