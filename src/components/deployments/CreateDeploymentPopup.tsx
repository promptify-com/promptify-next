import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import CreateForm from "./CreateForm";

interface CreateDeploymentPopupProps {
  onClose: () => void;
}

function CreateDeploymentPopup({ onClose }: CreateDeploymentPopupProps) {
  return (
    <Dialog
      open
      maxWidth={"lg"}
      onClose={onClose}
    >
      <DialogTitle fontSize={"22px"}>Create New Deployment</DialogTitle>
      <DialogContent>
        <CreateForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateDeploymentPopup;
