import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
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
  sparkId?: number;
  currentSparkTitle?: string;
  onSparkCreated: (spark: Spark) => void;
}

const SparkForm: React.FC<Props> = ({
  type,
  isOpen,
  close,
  templateId,
  executionId,
  onSparkCreated,
  sparkId,
  currentSparkTitle,
}) => {
  const [sparkTitle, setSparkTitle] = useState<string>("");

  useEffect(() => {
    if (type === "edit" && currentSparkTitle !== undefined) {
      setSparkTitle(currentSparkTitle);
    }
  }, [type, currentSparkTitle]);

  const [editSparkTitle, { isError }] = useEditSparkTitleMutation();

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
      if (sparkId !== undefined) {
        await editSparkTitle({
          id: sparkId,
          data: { initial_title: sparkTitle },
        });
        if (!isError) {
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
          }}
          disabled={!sparkTitle?.length}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SparkForm;
