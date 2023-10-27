import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import CreateForm from "./CreateForm";

interface CreateDeploymentPopupProps {
  onClose: () => void;
}

const CreateDeploymentPopup = ({ onClose }: CreateDeploymentPopupProps) => {
  return (
    <Dialog
      maxWidth={"lg"}
      open
      onClose={() => onClose()}
    >
      <DialogTitle fontSize={"22px"}>Create Deployment</DialogTitle>
      <DialogContent>
        <CreateForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeploymentPopup;
