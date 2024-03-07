import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { IChat } from "@/core/api/dto/chats";
import Image from "@/components/design-system/Image";
import { Box, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { DeleteForeverOutlined, MoreVert } from "@mui/icons-material";
import { useState } from "react";
import Edit from "@mui/icons-material/Edit";
import { useDeleteChatMutation } from "@/core/api/chats";
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";

interface Props {
  chat: IChat;
}

export const ChatCard = ({ chat }: Props) => {
  const dispatch = useAppDispatch();
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState<null | HTMLElement>(null);
  const handleOpenActions = (e: React.MouseEvent<HTMLElement>) => setActionsMenuAnchor(e.currentTarget);
  const handleCloseActions = () => setActionsMenuAnchor(null);
  const [imgError, setImgError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [deleteChat] = useDeleteChatMutation();

  const handleDeleteChat = async () => {
    try {
      await deleteChat(chat.id);
    } catch (_) {
      dispatch(setToast({ message: "Chat not deleted! Please try again.", severity: "error", duration: 6000 }));
    }
  };

  return (
    <Card
      elevation={0}
      title={chat.title}
      sx={{
        width: "100%",
        bgcolor: "surfaceContainerHigh",
        borderRadius: "16px",
        overflow: "hidden",
        "&:hover": {
          bgcolor: "surfaceContainerHighest",
        },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
        p={"16px 18px 16px 16px"}
      >
        <CardMedia
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
        >
          <Image
            src={!imgError && chat.thumbnail ? chat.thumbnail : require("@/assets/images/default-thumbnail.jpg")}
            onError={() => setImgError(true)}
            alt={chat.title}
            style={{ borderRadius: "50%", objectFit: "cover", width: "100%", height: "100%" }}
            priority={false}
          />
        </CardMedia>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, p: 0, overflow: "hidden" }}>
          <Typography
            fontSize={14}
            fontWeight={500}
            color={"onSurface"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
          >
            {chat.title}
          </Typography>
          <Typography
            fontSize={13}
            fontWeight={400}
            color={"onSurface"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
          >
            {chat.title}
          </Typography>
        </CardContent>
        <IconButton
          onClick={handleOpenActions}
          sx={{ border: "none", ":hover": { bgcolor: "action.hover" } }}
        >
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={actionsMenuAnchor}
          open={Boolean(actionsMenuAnchor)}
          onClose={handleCloseActions}
          disableScrollLock
          sx={{
            ".MuiPaper-root": {
              width: "199px",
              borderRadius: "16px",
            },
            ".MuiList-root": {
              p: 0,
            },
          }}
        >
          <MenuItem sx={menuItemStyle}>
            <Edit />
            <Box>Rename</Box>
          </MenuItem>
          {/* <MenuItem sx={menuItemStyle}>
            <FileCopyOutlined />
            <Box>Duplicate</Box>
          </MenuItem> */}
          <MenuItem
            onClick={() => setConfirmDelete(true)}
            sx={menuItemStyle}
          >
            <DeleteForeverOutlined />
            <Box>Delete</Box>
          </MenuItem>
        </Menu>
      </Stack>
      {confirmDelete && (
        <DeleteDialog
          open={true}
          dialogContentText={`Are you sure you want to remove this chat - ${chat.title}?`}
          onClose={() => setConfirmDelete(false)}
          onSubmit={handleDeleteChat}
        />
      )}
    </Card>
  );
};

const menuItemStyle = {
  gap: 2,
  p: "8px 8px 8px 16px",
  fontSize: 14,
  fontWeight: 400,
  svg: {
    fontSize: 20,
  },
};
