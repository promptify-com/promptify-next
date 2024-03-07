import { Button, Stack, Typography } from "@mui/material";
import { useCreateChatMutation, useGetChatsQuery } from "@/core/api/chats";
import { ChatCard } from "@/components/common/cards/CardChat";
import SearchField from "@/components/common/forms/SearchField";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import { setSelectedChat } from "../../core/store/chatSlice";
import { IChat } from "../../core/api/dto/chats";

interface Props {}

export default function ChatsHistory({}: Props) {
  const dispatch = useAppDispatch();
  const { data: chats, isLoading: loadingChats } = useGetChatsQuery();
  const [createChat] = useCreateChatMutation();
  const [search, setSearch] = useState("");
  const selectedChat = useAppSelector(state => state.chat.selectedChat);

  const handleNewChat = async () => {
    try {
      const newChat = await createChat({
        title: "Welcome",
      }).unwrap();
      handleClickChat(newChat);
    } catch (_) {
      dispatch(setToast({ message: "Chat not created! Please try again.", severity: "error", duration: 6000 }));
    }
  };

  const handleClickChat = (chat: IChat) => {
    dispatch(setSelectedChat(chat));
  };

  const filteredChats = chats?.filter(chat => chat.title.toLowerCase().includes(search));
  const emptyChats = Boolean(!chats?.length || chats?.length === 0);

  return (
    <Stack
      gap={4}
      py={"16px"}
    >
      <Stack gap={2}>
        <SearchField
          placeholder="Search in chats..."
          value={search}
          onChange={val => setSearch(val.toLowerCase())}
          disabled={emptyChats}
        />
        <Button
          onClick={handleNewChat}
          variant="contained"
          sx={{
            fontSize: 14,
            fontWeight: 500,
            ":disabled": {
              borderColor: "transparent",
              color: "white",
            },
          }}
        >
          New Chat
        </Button>
      </Stack>
      <Stack gap={2}>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"onSurface"}
        >
          Recent:
        </Typography>
        {!loadingChats &&
          (filteredChats && filteredChats?.length > 0 ? (
            filteredChats.map(chat => (
              <ChatCard
                key={chat.id}
                chat={chat}
                onClick={() => handleClickChat(chat)}
                active={chat.id === selectedChat?.id}
              />
            ))
          ) : (
            <Typography
              fontSize={14}
              fontWeight={400}
              color={"onSurface"}
              mt={"30px"}
              textAlign={"center"}
            >
              Let&apos;s start new chat!
            </Typography>
          ))}
      </Stack>
    </Stack>
  );
}
