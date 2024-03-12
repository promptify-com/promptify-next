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

interface Props {
  template: Templates;
}

function TemplateActions({ template }: Props) {
  const { saveFavorite, templateData } = useSaveFavoriteTemplate(template);

  const handleViewPromptInfo = () => {
    window.open(`/prompt/${template.slug}`, "_blank");
  };

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
