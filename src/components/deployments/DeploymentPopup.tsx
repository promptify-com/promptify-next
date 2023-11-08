import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import CreateForm from "./CreateForm";
import ExecuteForm from "./ExecuteForm";
import type { Deployment } from "@/common/types/deployments";

interface DeploymentPopupProps {
  variant: "create" | "execute";
  item?: Deployment;
  onClose: () => void;
}

function DeployementPopup({ onClose, variant, item }: DeploymentPopupProps) {
  const PopupTitle = variant === "create" ? "Create New Deployment" : "Execute Deployement";
  return (
    <Dialog
      open
      maxWidth={"lg"}
    >
      <DialogTitle fontSize={"22px"}>{PopupTitle}</DialogTitle>
      <DialogContent
        sx={{
          minWidth: { md: "520px" },
        }}
      >
        {variant === "create" && <CreateForm onClose={onClose} />}
        {variant === "execute" && (
          <ExecuteForm
            item={item!}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DeployementPopup;
