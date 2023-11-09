import { ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface DeploymentPopupProps {
  title: string;
  children: ReactNode;
}

function DeployementPopup({ title, children }: DeploymentPopupProps) {
  return (
    <Dialog
      open
      maxWidth={"lg"}
    >
      <DialogTitle fontSize={"22px"}>{title}</DialogTitle>
      <DialogContent
        sx={{
          minWidth: { md: "520px" },
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default DeployementPopup;
