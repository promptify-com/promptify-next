import { useRef, useState } from "react";
import QuestionAnswerOutlined from "@mui/icons-material/QuestionAnswerOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { Templates } from "@/core/api/dto/templates";
import useSaveFavoriteTemplate from "@/hooks/useSaveFavoriteTemplate";
import Favorite from "@mui/icons-material/Favorite";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import { FavoriteBorder } from "@mui/icons-material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { MoreVert } from "@mui/icons-material";

interface Props {
  template: Templates;
  onRun?: (newChat?: boolean) => void;
}

function TemplateActions({ template, onRun }: Props) {
  const [actionsOpened, setActionsOpened] = useState(false);
  const actionsAnchorRef = useRef<HTMLButtonElement>(null);

  const { saveFavorite, templateData } = useSaveFavoriteTemplate(template);

  const handleViewPromptInfo = () => {
    window.open(`/prompt/${template.slug}`, "_blank");
  };

  const handleRunPrompt = (newChat?: boolean) => {
    setActionsOpened(false);
    onRun?.(newChat);
  };
  return (
    <>
      <IconButton
        ref={actionsAnchorRef}
        onClick={() => setActionsOpened(true)}
        sx={{
          border: "none",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <MoreVert />
      </IconButton>
      {actionsOpened && (
        <Popper
          sx={{ zIndex: 1200 }}
          open={actionsOpened}
          anchorEl={actionsAnchorRef.current}
          placement={"bottom-end"}
          transition
        >
          {({ TransitionProps }) => (
            <Fade
              {...TransitionProps}
              timeout={350}
            >
              <Paper
                sx={{
                  borderRadius: "16px",
                  width: "218px",
                  marginTop: "5px",
                  overflow: "hidden",
                }}
                elevation={1}
              >
                <ClickAwayListener
                  onClickAway={() => {
                    console.log("close");
                    setActionsOpened(false);
                  }}
                >
                  <Stack
                    overflow={"hidden"}
                    direction={"column"}
                  >
                    <MenuItem
                      onClick={() => handleRunPrompt()}
                      sx={menuItemStyle}
                    >
                      <ChatBubbleOutline />
                      Start in this chat
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleRunPrompt(true)}
                      sx={menuItemStyle}
                    >
                      <QuestionAnswerOutlined />
                      Start in new chat
                    </MenuItem>
                    <Divider sx={{ m: "0 !important" }} />

                    <MenuItem
                      onClick={handleViewPromptInfo}
                      sx={menuItemStyle}
                    >
                      <VisibilityOutlined />
                      View prompt info
                    </MenuItem>

                    <MenuItem
                      onClick={() => saveFavorite(true)}
                      sx={menuItemStyle}
                    >
                      {templateData.is_liked ? (
                        <>
                          <Favorite />
                          Liked
                        </>
                      ) : (
                        <>
                          <FavoriteBorder />
                          Like
                        </>
                      )}
                    </MenuItem>

                    <MenuItem
                      onClick={() => saveFavorite()}
                      sx={menuItemStyle}
                    >
                      {templateData.is_favorite ? (
                        <>
                          <BookmarkBorder />
                          Add to favorites
                        </>
                      ) : (
                        <>
                          <Bookmark />
                          Remove from favorites
                        </>
                      )}
                    </MenuItem>
                    {/* <Stack
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
                    sx={menuItemStyle}
                  >
                    <DeleteOutline />
                    Remove
                  </MenuItem>
                </Stack> */}
                  </Stack>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
}

export default TemplateActions;

const menuItemStyle = {
  gap: 2,
  p: "8px 8px 8px 16px",
  fontSize: 14,
  fontWeight: 400,
  svg: {
    fontSize: 20,
  },
};
