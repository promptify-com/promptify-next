import { Stack, Typography } from "@mui/material";
import { useGetChatsQuery } from "../../core/api/chats";
import { ChatCard } from "../common/cards/CardChat";

interface Props {}

export default function ChatsHistory({}: Props) {
  const { data: chats } = useGetChatsQuery();

  return (
    <Stack
      gap={4}
      py={"16px"}
    >
      <Stack gap={2}></Stack>
      <Stack gap={2}>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"onSurface"}
        >
          Recent:
        </Typography>
        {chats?.map(chat => (
          <ChatCard
            key={chat.id}
            chat={chat}
          />
        ))}
      </Stack>
    </Stack>
  );
}
