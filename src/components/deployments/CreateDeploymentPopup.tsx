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
    >
      <DialogTitle fontSize={"22px"}>Create New Deployment</DialogTitle>
      <DialogContent
        sx={{
          minWidth: { md: "520px" },
        }}
      >
        <CreateForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateDeploymentPopup;
