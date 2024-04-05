import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { IChat } from "@/core/api/dto/chats";
import Image from "@/components/design-system/Image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import FileCopyOutlined from "@mui/icons-material/FileCopyOutlined";
import MoreVert from "@mui/icons-material/MoreVert";
import { useState } from "react";
import Edit from "@mui/icons-material/Edit";
import { useDeleteChatMutation, useDuplicateChatMutation, useUpdateChatMutation } from "@/core/api/chats";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { RenameForm } from "@/components/common/forms/RenameForm";
import { setSelectedChat } from "@/core/store/chatSlice";
import { LogoApp } from "@/assets/icons/LogoApp";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  chat: IChat;
  active?: boolean;
  onClick?(): void;
}

export const ChatCard = ({ chat, active, onClick }: Props) => {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState<null | HTMLElement>(null);
  const handleOpenActions = (e: React.MouseEvent<HTMLElement>) => setActionsMenuAnchor(e.currentTarget);
  const handleCloseActions = () => setActionsMenuAnchor(null);
  const [imgError, setImgError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [renameAllow, setRenameAllow] = useState(false);
  const selectedChat = useAppSelector(state => state.chat.selectedChat);
  const [deleteChat] = useDeleteChatMutation();
  const [updateChat] = useUpdateChatMutation();
  const [duplicateChat] = useDuplicateChatMutation();

  const handleUpdateChat = async (title: string) => {
    try {
      await updateChat({ id: chat.id, data: { title, thumbnail: chat.thumbnail } });
      setRenameAllow(false);
      dispatch(setToast({ message: "Chat updated successfully", severity: "success", duration: 6000 }));
    } catch (_) {
      dispatch(setToast({ message: "Chat not deleted! Please try again.", severity: "error", duration: 6000 }));
    }
  };

  const handleDeleteChat = async () => {
    try {
      await deleteChat(chat.id);
      if (selectedChat?.id === chat.id) {
        dispatch(setSelectedChat(undefined));
      }
      dispatch(setToast({ message: "Chat deleted successfully", severity: "success", duration: 6000 }));
    } catch (_) {
      dispatch(setToast({ message: "Chat not deleted! Please try again.", severity: "error", duration: 6000 }));
    }
  };

  const handleDuplicateChat = async () => {
    handleCloseActions();
    try {
      const newChat = await duplicateChat(chat.id).unwrap();
      dispatch(setSelectedChat(newChat));
      dispatch(setToast({ message: "Chat added successfully", severity: "success", duration: 6000 }));
    } catch (_) {
      dispatch(setToast({ message: "Chat not duplicated! Please try again.", severity: "error", duration: 6000 }));
    }
  };

  return (
    <Card
      elevation={0}
      title={chat.title}
      onClick={onClick}
      sx={{
        width: "100%",
        bgcolor: active ? "surfaceContainerLowest" : "surfaceContainerHigh",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        ".actions-menu": {
          opacity: isMobile ? 1 : 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover": {
          bgcolor: "surfaceContainerHighest",
          ".actions-menu": {
            opacity: 1,
          },
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!imgError && chat.thumbnail ? (
            <Image
              src={chat.thumbnail}
              onError={() => setImgError(true)}
              alt={"P"}
              style={{ borderRadius: "50%", objectFit: "cover", width: "100%", height: "100%" }}
              priority={false}
            />
          ) : (
            <LogoApp width={26} />
          )}
        </CardMedia>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, p: 0, overflow: "hidden" }}>
          {!renameAllow ? (
            <>
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
                {chat.last_message}
              </Typography>
            </>
          ) : (
            <Box onClick={e => e.stopPropagation()}>
              <RenameForm
                placeholder="New Chat"
                initialValue={chat.title}
                onSave={handleUpdateChat}
                onCancel={() => setRenameAllow(false)}
              />
            </Box>
          )}
        </CardContent>
        {!renameAllow && (
          <IconButton
            onClick={e => {
              e.stopPropagation();
              handleOpenActions(e);
            }}
            className="actions-menu"
            sx={{
              border: "none",
              ...(isMobile && { bgcolor: "action.hover" }),
              ":hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <MoreVert />
          </IconButton>
        )}
        <Menu
          anchorEl={actionsMenuAnchor}
          open={Boolean(actionsMenuAnchor)}
          onClose={handleCloseActions}
          disableScrollLock
          onClick={e => e.stopPropagation()}
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
          <MenuItem
            onClick={() => {
              setRenameAllow(true);
              handleCloseActions();
            }}
            sx={menuItemStyle}
          >
            <Edit />
            <Box>Rename</Box>
          </MenuItem>
          <MenuItem
            onClick={handleDuplicateChat}
            sx={menuItemStyle}
          >
            <FileCopyOutlined />
            <Box>Duplicate</Box>
          </MenuItem>
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
