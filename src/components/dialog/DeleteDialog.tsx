import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { red } from "@mui/material/colors";

interface DeleteDialogProps {
  open: boolean;
  dialogTitle: string;
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

  useEffect(() => {
    if (open) {
      setIsLoading(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        fontSize={26}
      >
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{dialogContentText}</DialogContentText>
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
