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
import { red } from "@mui/material/colors";
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
      <DialogTitle id="alert-dialog-title" fontSize={26}>
        {dialogTitle}
      </DialogTitle>
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
            bgcolor: red[400],
            color: "white",
            minWidth: "90px",
            "&:hover": {
              bgcolor: red[700],
            },
          }}
        >
          {onSubmitLoading ? (
            <CircularProgress size={20} />
          ) : (
            <span>Confirm</span>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
