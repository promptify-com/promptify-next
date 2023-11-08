import { useState } from "react";
import type { Deployment } from "@/common/types/deployments";
import Button from "@mui/material/Button";
import DeployementPopup from "./DeploymentPopup";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { PlayCircle } from "@mui/icons-material";
import { isDesktopViewPort } from "@/common/helpers";

interface Props {
  item: Deployment;
}

export function ExecuteDeploymentButton({ item }: Props) {
  const [openPopup, setOpenPopup] = useState(false);
  const isDesktop = isDesktopViewPort();

  return (
    <>
      {/* <Button
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
      </Button> */}

      <Tooltip title="Try it">
        <IconButton
          onClick={() => setOpenPopup(true)}
          sx={{
            border: "none",
            display: item.status !== "done" ? "none" : "block",
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
        <DeployementPopup
          variant="execute"
          onClose={() => setOpenPopup(false)}
          item={item}
        />
      )}
    </>
  );
}
