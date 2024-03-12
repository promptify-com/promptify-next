import BookmarkBorderOutlined from "@mui/icons-material/BookmarkBorderOutlined";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import QuestionAnswerOutlined from "@mui/icons-material/QuestionAnswerOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  template: Templates;
}

function TemplateActions({ template }: Props) {
  return (
    <Stack
      overflow={"hidden"}
      direction={"column"}
    >
      <MenuItem
        onClick={() => {}}
        sx={menuItemStyle}
      >
        <ChatBubbleOutline />
        Start in this chat
      </MenuItem>
      <MenuItem
        onClick={() => {}}
        sx={menuItemStyle}
      >
        <QuestionAnswerOutlined />
        Start in new chat
      </MenuItem>
      <Divider sx={{ m: "0 !important" }} />

      <MenuItem
        onClick={() => {}}
        sx={menuItemStyle}
      >
        <VisibilityOutlined />
        view prompt info
      </MenuItem>

      <MenuItem
        onClick={() => {}}
        sx={menuItemStyle}
      >
        <FavoriteBorderOutlined />
        Like
      </MenuItem>

      <MenuItem
        onClick={() => {}}
        sx={menuItemStyle}
      >
        <BookmarkBorderOutlined />
        Add to favorites
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
