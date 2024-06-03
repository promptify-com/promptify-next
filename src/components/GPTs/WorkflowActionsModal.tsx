import Stack from "@mui/material/Stack";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { IWorkflow } from "../Automation/types";
import Box from "@mui/material/Box";

interface WorkflowActionsModalProps {
  open: boolean;
  workflow: IWorkflow | null;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onEdit: () => void;
  onPause: () => void;
  onRemove: () => void;
}

function WorkflowActionsModal({
  open,
  workflow,
  anchorEl,
  onClose,
  onEdit,
  onPause,
  onRemove,
}: WorkflowActionsModalProps) {
  if (!workflow) return null;

  return (
    <Popper
      sx={{
        zIndex: 1200,
      }}
      open={open}
      anchorEl={anchorEl}
      placement={"bottom-end"}
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [20, 20],
          },
        },
      ]}
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
            <ClickAwayListener onClickAway={onClose}>
              <Stack
                overflow={"hidden"}
                direction={"column"}
              >
                <MenuItem
                  sx={menuItemStyle}
                  onClick={onEdit}
                >
                  Edit GPT
                </MenuItem>
                <MenuItem
                  sx={menuItemStyle}
                  onClick={onPause}
                >
                  Pause GPT
                </MenuItem>
                <MenuItem
                  sx={menuItemStyle}
                  onClick={onRemove}
                >
                  Remove GPT
                </MenuItem>
              </Stack>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}

export default WorkflowActionsModal;

const menuItemStyle = {
  color: "#000",
  fontSize: "13px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "150%",
  "&:hover": {
    display: "flex",
    padding: "5px 10px",
    alignItems: "flex-start",
    gap: "8px",
    borderRadius: "100px",
    background: "#FFE1E1",
  },
};
