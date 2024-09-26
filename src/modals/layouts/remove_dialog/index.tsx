import { useState } from "react";
// Mui
// Mui
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { red } from "@mui/material/colors/";
// Redux
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { handleClose } from "@/core/store/layout/RemoveDialogSlice";

function DeleteDialog() {
  const [isLoading, setIsLoading] = useState(false);
  /// Store
  const dispatch = useAppDispatch();
  const dialog = useAppSelector(({ layout }) => layout?.remove_dialog);

  //
  const handleSubmit = () => {
    dialog?.onSubmit();
    setIsLoading(true);
  };
  const handleCloseDialog = () => {
    dispatch(handleClose());
  };

  return (
    <Dialog
      open={dialog?.open ?? false}
      disableScrollLock={true}
      onClose={handleCloseDialog}
    >
      <DialogTitle fontSize={26}>{dialog?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialog?.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ "&:hover": { background: "#5a58cb24" } }}
          onClick={handleCloseDialog}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            bgcolor: red[400],
            color: "white",
            minWidth: "90px",
            "&:hover": { bgcolor: red[700] },
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : <span>Confirm</span>}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
