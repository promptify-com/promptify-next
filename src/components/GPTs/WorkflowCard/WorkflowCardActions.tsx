import { Dispatch, useRef, useState } from "react";
// Mui
import { Box } from "@mui/material";
import { GearIcon } from "@/assets/icons/GearIcon";
// Modals
import WorkflowActionsModal from "./WorkflowActionsModal";
import DeleteDialog from "@/modals/layouts/remove_dialog";
//
import type { ITemplateWorkflow } from "../../Automation/types";

interface Props {
  workflow?: ITemplateWorkflow;
  userWorkflowId?: string;
  isPaused: boolean;
  setIsPaused: Dispatch<boolean>;
  sx: object;
}

function WorkflowCardActions({ workflow, userWorkflowId, isPaused, setIsPaused, sx }: Props) {
  // Stats
  const [open, setOpen] = useState<boolean>();
  const actionsAnchorRef = useRef<HTMLButtonElement>(null);
  //
  const handleOpenModal = () => {
    setOpen(!open);
  };
  console.log(workflow);

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
      <DeleteDialog />
    </>
  );
}

export default WorkflowCardActions;
