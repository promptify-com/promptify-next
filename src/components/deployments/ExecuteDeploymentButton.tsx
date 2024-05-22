import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PlayCircle from "@mui/icons-material/PlayCircle";

import DeployementPopup from "./DeploymentPopup";
import ExecuteForm from "./ExecuteForm";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  modelName: string;
  deploymentId: number;
}

export function ExecuteDeploymentButton({ modelName, deploymentId }: Props) {
  const [openPopup, setOpenPopup] = useState(false);
  const { isMobile } = useBrowser();

  return (
    <>
      <Tooltip title="Try it">
        <IconButton
          onClick={() => setOpenPopup(true)}
          sx={{
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
              opacity: 1,
            },
          }}
        >
          <PlayCircle
            sx={{
              opacity: !isMobile ? 0.25 : 1,
              fontSize: "16px",
              "&:hover": {
                opacity: 1,
              },
            }}
          />
        </IconButton>
      </Tooltip>

      {openPopup && (
        <DeployementPopup title={`Try ${modelName}`}>
          <ExecuteForm
            deploymentId={deploymentId}
            onClose={() => setOpenPopup(false)}
          />
        </DeployementPopup>
      )}
    </>
  );
}
