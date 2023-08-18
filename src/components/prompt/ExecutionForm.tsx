import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { usePutExecutionTitleMutation } from "@/core/api/executions";

type DialogType = "new" | "edit";

interface Props {
  type: DialogType;
  isOpen: boolean;
  executionId?: number;
  activeExecution?: TemplatesExecutions;
  onClose: () => void;
  onCancel?: () => void;
  onSaved?: () => void;
}

const ExecutionForm: React.FC<Props> = ({
  type,
  isOpen,
  executionId,
  activeExecution,
  onClose,
  onCancel = () => null,
  onSaved = () => null,
}) => {
  const [executionTitle, setExecutionTitle] = useState<string>("");

  useEffect(() => {
    if (type === "edit" && activeExecution?.title !== undefined) {
      setExecutionTitle(activeExecution.title);
    }
  }, [type, activeExecution, onClose]);

  const [updateExecutionTitle, { isError, isLoading }] = usePutExecutionTitleMutation();

  const handleCancel = () => {
    onCancel();
    setExecutionTitle("");
    onClose();
  };

  const handleSave = async () => {
    if (executionTitle.length && executionId) {
      await updateExecutionTitle({
        id: executionId,
        data: { title: executionTitle },
      });
      if (!isError && !isLoading) {
        onSaved();
        setExecutionTitle("");
        onClose();
      }
    }
  };

  const dialogTitle = type === "new" ? "Enter a title for your new spark:" : "Update the title of your spark";

  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        sx: { bgcolor: "surface.1" },
      }}
    >
      <DialogTitle sx={{ fontSize: 16, fontWeight: 400 }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          sx={{
            ".MuiInputBase-input": {
              p: 0,
              color: "onSurface",
              fontSize: 48,
              fontWeight: 400,
              "&::placeholder": { color: "grey.600" },
            },
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            ".MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: 0,
            },
          }}
          placeholder={"Title..."}
          onChange={e => setExecutionTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: "16px", gap: 2 }}>
        <Button
          sx={{ minWidth: "auto", p: 0, color: "grey.600" }}
          onClick={handleCancel}
        >
          Skip
        </Button>
        <Button
          sx={{
            ":disabled": { color: "grey.600" },
            ":hover": { bgcolor: "action.hover" },
            maxWidth: "94px",
          }}
          disabled={!executionTitle.length}
          onClick={handleSave}
        >
          {isLoading ? <CircularProgress size={20} /> : <Typography>Save</Typography>}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExecutionForm;
