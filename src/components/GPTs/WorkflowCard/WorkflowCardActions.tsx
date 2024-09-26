import { Dispatch, useRef, useState } from "react";
import { Box } from "@mui/material";
import { GearIcon } from "@/assets/icons/GearIcon";
import WorkflowActionsModal from "./WorkflowActionsModal";
import type { ITemplateWorkflow } from "../../Automation/types";

interface Props {
  workflow?: ITemplateWorkflow;
  userWorkflowId?: string;
  isPaused: boolean;
  setIsPaused: Dispatch<boolean>;
  sx?: object;
}

function WorkflowCardActions({ workflow, userWorkflowId, isPaused, setIsPaused, sx }: Props) {
  const [open, setOpen] = useState<boolean>();
  const actionsAnchorRef = useRef<HTMLButtonElement>(null);
  const handleOpenModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box
        ref={actionsAnchorRef}
        onClick={handleOpenModal}
        sx={{
          ...sx,
          display: "flex",
          width: "32px",
          height: "32px",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          borderRadius: "100px",
          border: "1px solid rgba(0, 0, 0, 0.10)",
          background: "#FFF",
          cursor: "pointer",
        }}
      >
        <GearIcon />
      </Box>
      {open && (
        <WorkflowActionsModal
          workflow={workflow}
          anchorEl={actionsAnchorRef.current}
          setOpen={setOpen}
          open={open}
          userWorkflowId={userWorkflowId}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
        />
      )}
    </>
  );
}

export default WorkflowCardActions;
