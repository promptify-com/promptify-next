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
import { createSpark, createSparkWithExecution } from "@/hooks/api/executions";
import { Spark } from "@/core/api/dto/templates";
import { useEditSparkTitleMutation } from "@/core/api/sparks";

type DialogType = "new" | "edit";

interface Props {
  type: DialogType;
  isOpen: boolean;
  close: () => void;
  templateId?: number;
  executionId?: number;
  activeSpark?: Spark;
  onSparkCreated: (spark: Spark) => void;
}

const SparkForm: React.FC<Props> = ({
  type,
  isOpen,
  close,
  templateId,
  executionId,
  onSparkCreated,
  activeSpark,
}) => {
  const [sparkTitle, setSparkTitle] = useState<string>("");

  useEffect(() => {
    if (type === "edit" && activeSpark?.initial_title !== undefined) {
      setSparkTitle(activeSpark.initial_title);
    }
  }, [type, activeSpark]);

  const [editSparkTitle, { isError, isLoading }] = useEditSparkTitleMutation();

  const closeTitleModal = () => {
    close();
    setSparkTitle("");
  };

  const handleSave = async () => {
    if (type === "new" && sparkTitle.length) {
      // If executionId is passed, create a spark with execution_id, otherwise create a empty spark with templateId
      // TODO: Handle error
      let sparkCreated: Spark;

      try {
        if (executionId) {
          sparkCreated = await createSparkWithExecution({
            title: sparkTitle,
            execution_id: executionId,
          });
        } else {
          sparkCreated = await createSpark({
            initial_title: sparkTitle,
            template: templateId,
          });
        }

        onSparkCreated(sparkCreated);
      } catch (err) {
        console.error(err);
      }
      close();
      setSparkTitle("");
    } else {
      if (activeSpark?.id !== undefined) {
        await editSparkTitle({
          id: activeSpark.id,
          data: { initial_title: sparkTitle },
        });
        if (!isError && !isLoading) {
          close();
        }
      }
    }
  };

  const dialogTitle =
    type == "new"
      ? "Enter a title for your new spark:"
      : "Update the title of your spark";

  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        sx: { bgcolor: "surface.1" },
      }}
    >
      <DialogTitle sx={{ fontSize: 16, fontWeight: 400 }}>
        {dialogTitle}
      </DialogTitle>
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
          value={sparkTitle}
          placeholder={"Title..."}
          onChange={(e) => setSparkTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: "16px", gap: 2 }}>
        <Button
          sx={{
            minWidth: "auto",
            p: 0,
            color: "grey.600",
            display: type == "edit" ? "none" : "block",
          }}
          onClick={closeTitleModal}
        >
          Skip
        </Button>
        <Button
          sx={{
            ":disabled": { color: "grey.600" },
            ":hover": { bgcolor: "action.hover" },
            maxWidth: "94px",
          }}
          disabled={!sparkTitle?.length}
          onClick={handleSave}
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography>Save</Typography>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SparkForm;
