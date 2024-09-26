import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { red } from "@mui/material/colors/";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { handleClose, setLoading } from "@/core/store/layout/RemoveDialogSlice";

function DeleteDialog() {
  const dispatch = useAppDispatch();
  const dialog = useAppSelector(({ layout }) => layout?.remove_dialog);
  const handleSubmit = () => {
    dispatch(setLoading(true));
    dialog?.onSubmit();
  };
  const handleCloseDialog = () => {
    dispatch(handleClose());
  };

  return (
    <Dialog
      open={dialog?.open ?? false}
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
          disabled={dialog?.loading ?? false}
        >
          {dialog?.loading ?? false ? <CircularProgress size={20} /> : <span>Confirm</span>}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
