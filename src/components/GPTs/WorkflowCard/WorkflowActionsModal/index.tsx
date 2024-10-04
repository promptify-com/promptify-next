import { Dispatch } from "react";
import { useRouter } from "next/router";
import { Stack, Popper, Fade, ClickAwayListener, Paper, Box } from "@mui/material";
import { ITemplateWorkflow } from "../../../Automation/types";
import EditWorkflow from "./edit";
import PauseWorkflow from "./pause";
import ResumeWorkflow from "./resume";
import RemoveWorkflow from "./remove";

interface Props {
  open: boolean;
  setOpen: Dispatch<boolean>;
  workflow?: ITemplateWorkflow;
  anchorEl: HTMLElement | null;
  userWorkflowId?: string;
  isPaused: boolean;
  setIsPaused: Dispatch<boolean>;
  setOpenDialog: (value: boolean) => void;
}

function WorkflowActionsModal({ open, setOpen, workflow, anchorEl, userWorkflowId, isPaused, setIsPaused, setOpenDialog }: Props) {
  const router = useRouter();
  const isEditPage = router.pathname === "/apps/[slug]";

  return (
    <Popper
      sx={{ zIndex: 1200 }}
      open={open}
      anchorEl={anchorEl}
      placement={"bottom-end"}
      modifiers={[{ name: "offset", options: { offset: [20, 20] } }]}
      transition
    >
      {({ TransitionProps }) => (
        <Fade
          {...TransitionProps}
          timeout={350}
        >
          <Paper
            sx={{
              opacity: 1,
              transition: "opacity 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              display: "inline-flex",
              padding: "16px 20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.10)",
              background: "#FFF",
              boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.10)",
            }}
            elevation={1}
          >
            <Box
              sx={{
                width: "14px",
                height: "14px",
                transform: "rotate(45deg)",
                position: "absolute",
                right: "30.201px",
                top: "-7px",
                border: "1px solid rgba(0, 0, 0, 0.10)",
                background: "#FFF",
                borderBottom: 0,
                borderRight: 0,
              }}
            />
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <Stack
                overflow={"hidden"}
                direction={"column"}
              >
                {!isEditPage && (
                  <EditWorkflow
                    setOpen={setOpen}
                    template_slug={String(workflow?.slug)}
                  />
                )}
                {!isPaused ? (
                  <PauseWorkflow
                    setOpen={setOpen}
                    workflow_id={String(userWorkflowId)}
                    setIsPaused={setIsPaused}
                  />
                ) : (
                  <ResumeWorkflow
                    setOpen={setOpen}
                    workflow_id={String(userWorkflowId)}
                    setIsPaused={setIsPaused}
                  />
                )}
                <RemoveWorkflow  setOpen={setOpen} setOpenDialog={setOpenDialog} />
              </Stack>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}

export default WorkflowActionsModal;
