import { useState } from "react";
import type { Deployment } from "@/common/types/deployments";
import Button from "@mui/material/Button";
import DeployementPopup from "./DeploymentPopup";

interface Props {
  item: Deployment;
}

export function ExecuteDeploymentButton({ item }: Props) {
  const [openPopup, setOpenPopup] = useState(false);
  return (
    <>
      <Button
        variant={item.status === "done" ? "outlined" : "contained"}
        size="small"
        onClick={() => setOpenPopup(true)}
        disabled={item.status !== "done"}
        sx={{
          height: "30px",
          width: "75px",
          border: item.status === "done" ? "1px solid gray" : "none",
        }}
      >
        Execute
      </Button>

      {openPopup && (
        <DeployementPopup
          variant="execute"
          onClose={() => setOpenPopup(false)}
          item={item}
        />
      )}
    </>
  );
}
