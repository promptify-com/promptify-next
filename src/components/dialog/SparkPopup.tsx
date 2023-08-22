import { Check, DeleteRounded } from "@mui/icons-material";
import { Dialog, Grid, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import BaseButton from "../base/BaseButton";
import { Execution, ExecutionTemplatePopupType } from "@/core/api/dto/templates";
import { useDeleteExecutionMutation, usePutExecutionTitleMutation } from "@/core/api/executions";
import { useDispatch } from "react-redux";
import { handleOpenPopup } from "@/core/store/executionsSlice";

interface SparkPopupProps {
  type: ExecutionTemplatePopupType;
  open: boolean;
  activeExecution: Execution | null;
}

export const SparkPopup: React.FC<SparkPopupProps> = ({ open, type, activeExecution }) => {
  const dispatch = useDispatch();
  const [updateExecution, { isError }] = usePutExecutionTitleMutation();
  const [deleteExecution, { isError: isDeleteExecutionError }] = useDeleteExecutionMutation();
  const [executionTitle, setExecutionTitle] = useState("");
  useEffect(() => {
    if (activeExecution && activeExecution.title !== "") {
      setExecutionTitle(activeExecution.title);
    }
  }, []);

  const onClose = () => {
    dispatch(handleOpenPopup(false));
  };
  const handleUpdateExecution = () => {
    if (activeExecution) {
      let data = {
        title: executionTitle,
      };
      updateExecution({ id: activeExecution.id, data }).unwrap();
      if (!isDeleteExecutionError) {
        onClose();
      }
    }
  };

  const handleDeleteExecution = () => {
    if (activeExecution) {
      deleteExecution(activeExecution.id).unwrap();
      if (!isError) {
        onClose();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {type === "update" ? (
        <Grid
          width={"318px"}
          padding={"16px"}
          display={"flex"}
          flexDirection={"column"}
          gap={"8px"}
        >
          <TextField
            defaultValue={activeExecution?.title}
            onChange={e => setExecutionTitle(e.target.value)}
            id="standard-basic"
            label="Rename Spark"
            variant="standard"
            fullWidth
            color="secondary"
          />
          <Grid
            display={"flex"}
            gap={"8px"}
            paddingY={"8px"}
            alignItems={"center"}
          >
            <BaseButton
              onClick={() => handleUpdateExecution()}
              color="custom"
              variant="contained"
              size="small"
              sx={{
                height: "30px",
                px: 0,
                bgcolor: "#375CA9",
                border: "none",
                "&:hover": {
                  bgcolor: "surface.5",
                },
              }}
            >
              <Check sx={{ fontSize: "16px", mr: "2px" }} />
              Ok
            </BaseButton>
            <BaseButton
              onClick={() => onClose()}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                height: "30px",
                px: 0,
              }}
            >
              Cancel
            </BaseButton>
          </Grid>
        </Grid>
      ) : (
        <Grid
          padding={"16px"}
          display={"flex"}
          flexDirection={"column"}
          gap={"8px"}
        >
          <Typography
            fontSize={"18px"}
            fontWeight={500}
            lineHeight={"25.74px"}
          >
            You really want to delete this spark permanently?
          </Typography>
          <Grid
            display={"flex"}
            gap={"8px"}
            paddingY={"8px"}
            alignItems={"center"}
          >
            <BaseButton
              onClick={() => handleDeleteExecution()}
              color="custom"
              variant="contained"
              size="small"
              sx={{
                bgcolor: red[400],
                height: "30px",
                border: "none",
                "&:hover": {
                  bgcolor: "surface.5",
                },
              }}
            >
              <DeleteRounded sx={{ fontSize: "16px", mr: "2px" }} />
              Yes, Delete
            </BaseButton>
            <BaseButton
              onClick={() => onClose()}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                height: "30px",
                px: 0,
              }}
            >
              Cancel
            </BaseButton>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
};
