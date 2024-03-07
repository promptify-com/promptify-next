import { Button, Stack, Typography } from "@mui/material";
import { useCreateChatMutation, useGetChatsQuery } from "@/core/api/chats";
import { ChatCard } from "@/components/common/cards/CardChat";
import SearchField from "@/components/common/forms/SearchField";
import { useState } from "react";

interface Props {}

export default function ChatsHistory({}: Props) {
  const { data: chats } = useGetChatsQuery();
  const [createChat] = useCreateChatMutation();
  const [search, setSearch] = useState("");

  const filteredChats = chats?.filter(chat => chat.title.toLowerCase().includes(search));

  const handleNewChat = async () => {
    try {
      await createChat({
        title: "Welcome",
      });
    } catch (err) {}
  };

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
        {filteredChats?.map(chat => (
          <ChatCard
            key={chat.id}
            chat={chat}
          />
        ))}
      </Stack>
    </Stack>
  );
}
