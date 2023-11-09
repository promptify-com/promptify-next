import { useState } from "react";
import { theme } from "@/theme";
import Add from "@mui/icons-material/Add";
import { alpha } from "@mui/material";

import BaseButton from "../base/BaseButton";
import DeployementPopup from "./DeploymentPopup";
import CreateForm from "./CreateForm";

function CreateDeploymentButton({ onRefetch }: { onRefetch: () => void }) {
  const [openpopup, setOpenpopup] = useState(false);
  return (
    <>
      <BaseButton
        variant="contained"
        color="primary"
        sx={btnStyle}
        startIcon={<Add sx={{ fontSize: 20 }} />}
        onClick={() => setOpenpopup(true)}
      >
        Create
      </BaseButton>
      {openpopup && (
        <DeployementPopup title="Create New Deployment">
          <CreateForm
            onClose={() => {
              setOpenpopup(false);
              onRefetch();
            }}
          />
        </DeployementPopup>
      )}
    </>
  );
}

export default CreateDeploymentButton;

const btnStyle = {
  color: "surface.1",
  fontSize: 14,
  p: "6px 16px",
  borderRadius: "8px",
  border: `1px solid ${alpha(theme.palette.onSurface, 0.2)}`,
  ":hover": {
    bgcolor: "action.hover",
  },
};
