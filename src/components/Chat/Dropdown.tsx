import { type MutableRefObject } from "react";
import { BookmarkBorderOutlined, FavoriteBorderOutlined, QuestionAnswerOutlined } from "@mui/icons-material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";

interface Props {
  open: boolean;
  ref: MutableRefObject<HTMLDivElement | null>;
  onClose: () => void;
}

function Dropdown({ open, ref, onClose }: Props) {
  return (
    <Popper
      open={open}
      anchorEl={ref.current}
      placement="bottom-end"
      transition
      disablePortal
      sx={{
        zIndex: 10000,
        position: "absolute",
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: "left top",
          }}
        >
          <Paper
            sx={{
              borderRadius: "24px",
              width: "220px",
              marginTop: "5px",
              overflow: "hidden",
            }}
            elevation={0}
          >
            <ClickAwayListener onClickAway={onClose}>
              <Stack
                borderRadius={"24px"}
                overflow={"hidden"}
                direction={"column"}
              >
                <Stack
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {}}
                    sx={{
                      display: "flex",
                      padding: "8px 8px 8px 16px",
                      alignItems: "center",
                      gap: 1,
                      "&:hover": {
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <QuestionAnswerOutlined />
                    Start in new chat
                  </MenuItem>
                </Stack>
                <Divider />

                <MenuItem
                  onClick={() => {}}
                  sx={{
                    mt: 0.5,
                    padding: "8px 8px 8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <VisibilityOutlined />
                  view prompt info
                </MenuItem>

                <MenuItem
                  onClick={() => {}}
                  sx={{
                    padding: "8px 8px 8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <FavoriteBorderOutlined />
                  Like
                </MenuItem>

                <MenuItem
                  onClick={() => {}}
                  sx={{
                    padding: "8px 8px 8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <BookmarkBorderOutlined />
                  Add to favorites
                </MenuItem>
                <Stack
                  mt={0.5}
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Divider />
                  <MenuItem
                    onClick={() => {}}
                    sx={{
                      padding: "8px 8px 8px 16px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&:hover": {
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <DeleteOutline />
                    Remove
                  </MenuItem>
                </Stack>
              </Stack>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

export default Dropdown;
