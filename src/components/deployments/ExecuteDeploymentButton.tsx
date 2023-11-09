import { useState } from "react";
import type { Deployment } from "@/common/types/deployments";
import Button from "@mui/material/Button";
import DeployementPopup from "./DeploymentPopup";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { PlayCircle } from "@mui/icons-material";
import { isDesktopViewPort } from "@/common/helpers";
import ExecuteForm from "./ExecuteForm";

interface Props {
  item: Deployment;
}

export function ExecuteDeploymentButton({ item }: Props) {
  const [openPopup, setOpenPopup] = useState(false);
  const isDesktop = isDesktopViewPort();

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
              opacity: isDesktop ? 0.25 : 1,
              fontSize: "16px",
              "&:hover": {
                opacity: 1,
              },
            }}
          />
        </IconButton>
      </Tooltip>

      {openPopup && (
        <DeployementPopup title={`Try ${item.model.name}`}>
          <ExecuteForm
            item={item!}
            onClose={() => setOpenPopup(false)}
          />
        </DeployementPopup>
      )}
    </>
  );
}
