import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

interface DeleteDialogProps {
  open: boolean;
  dialogTitle: string;
  dialogContentText: string;
  onClose: () => void;
  onSubmitLoading: boolean;
  onSubmit: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  dialogTitle,
  dialogContentText,
  onClose,
  onSubmitLoading,
  onSubmit,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogContentText}
        </DialogContentText>
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
          onClick={() => onSubmit()}
          sx={{
            "&:hover": {
              background: "#5a58cb24",
              maxWidth: "120px",
            },
          }}
        >
          {onSubmitLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography>Remove</Typography>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
