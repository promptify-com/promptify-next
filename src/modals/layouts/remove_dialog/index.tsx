import { useState } from "react";
// Mui
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { red } from "@mui/material/colors/";
// Redux
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { handleClose } from "@/core/store/layout/RemoveDialogSlice";

function DeleteDialog() {
  const [isLoading, setIsLoading] = useState(false);
  /// Store
  const dispatch = useAppDispatch();
  const { open, content, title, onSubmit } = useAppSelector(({ layout }) => layout.remove_dialog);

  //
  const handleSubmit = () => {
    onSubmit();
    setIsLoading(true);
  };
  const handleCloseDialog = (e: MouseEvent) => {
    dispatch(handleClose());
  };

  return (
    <Dialog
      open={open}
      disableScrollLock={true}
      onClose={() => handleCloseDialog()}
    >
      <DialogTitle fontSize={26}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ "&:hover": { background: "#5a58cb24" } }}
          onClick={() => handleCloseDialog()}
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
