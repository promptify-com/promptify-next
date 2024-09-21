import { useState } from "react";
import { red } from "@mui/material/colors/";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface DeleteDialogProps {
  open: boolean;
  dialogTitle?: string;
  dialogContentText: string;
  onClose: () => void;
  onSubmit: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  dialogTitle,
  dialogContentText,
  onClose,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog
      open={open}
      disableScrollLock={true}
      onClose={() => onClose()}
    >
      <DialogTitle fontSize={26}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            "&:hover": {
              background: "#5a58cb24",
            },
          }}
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSubmit();
            setIsLoading(true);
          }}
          sx={{
            bgcolor: red[400],
            color: "white",
            minWidth: "90px",
            "&:hover": {
              bgcolor: red[700],
            },
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : <span>Confirm</span>}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
