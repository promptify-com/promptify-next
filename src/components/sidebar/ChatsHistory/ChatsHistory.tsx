import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCreateChatMutation } from "@/core/api/chats";
import { ChatCard } from "@/components/common/cards/CardChat";
import SearchField from "@/components/common/forms/SearchField";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import { setChats, setInitialChat, setSelectedChat } from "@/core/store/chatSlice";
import { IChat } from "@/core/api/dto/chats";
import { ChatCardPlaceholder } from "@/components/placeholders/ChatCardPlaceholder";
import { useRouter } from "next/router";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { useChatsPaginator } from "@/components/Chat/Hooks/useChatsPaginator";

interface Props {
  onClose?: () => void;
}

export default function ChatsHistory({ onClose }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { selectedChat, chats } = useAppSelector(state => state.chat);
  const { isChatsLoading, isChatsFetching, handleNextPage, hasMore } = useChatsPaginator();

  const loadedChats = useMemo(() => {
    if (!chats?.length) {
      return {} as Record<number, IChat>;
    }

    return chats.reduce(
      (acc, chat) => {
        acc[chat.id] = chat;

        return acc;
      },
      {} as Record<number, IChat>,
    );
  }, [chats]);

  const [createChat] = useCreateChatMutation();

  const handleNewChat = async () => {
    if (!currentUser?.id) {
      return router.push("/signin");
    }

    try {
      const newChat = await createChat({
        title: "Welcome",
      }).unwrap();
      handleClickChat(newChat);
      dispatch(setChats([newChat, ...chats]));
      dispatch(setInitialChat(false));
      dispatch(setToast({ message: "Chat added successfully", severity: "success", duration: 6000 }));
    } catch (_) {
      dispatch(setToast({ message: "Chat not created! Please try again.", severity: "error", duration: 6000 }));
    }
  };

  const handleClickChat = (chat: IChat) => {
    dispatch(setSelectedChat(chat));
    dispatch(setInitialChat(false));
    onClose?.();
  };

  useEffect(() => {
    if (!router.query.ci) {
      return;
    }

    const chatId = Number(router.query.ci);

    if (loadedChats[chatId]) {
      handleClickChat(loadedChats[chatId]);
      router.replace(
        {
          pathname: router.pathname,
          query: undefined,
        },
        undefined,
        { scroll: false, shallow: true },
      );
    }
  }, [router, loadedChats]);

  const filteredChats =
    search.length >= 2 ? chats?.filter(chat => chat.title.toLowerCase().indexOf(search) > -1) : chats;
  const emptyChats = chats?.length === 0;

  const CardsPlaceholder = <ChatCardPlaceholder count={6} />;

  return (
    <Stack
      gap={4}
      className="chat-history"
      zIndex={1000}
      sx={{
        py: "16px",
      }}
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
        {isChatsLoading ? (
          CardsPlaceholder
        ) : filteredChats && filteredChats?.length > 0 ? (
          <InfiniteScrollContainer
            loading={isChatsFetching}
            onLoadMore={handleNextPage}
            hasMore={hasMore}
            placeholder={CardsPlaceholder}
          >
            {filteredChats.map(chat => (
              <ChatCard
                key={chat.id}
                chat={chat}
                onClick={() => handleClickChat(chat)}
                active={chat.id === selectedChat?.id}
              />
            ))}
          </InfiniteScrollContainer>
        ) : (
          <>
            <Typography
              fontSize={14}
              fontWeight={400}
              color={"onSurface"}
              mt={"30px"}
              textAlign={"center"}
              sx={{
                opacity: 0.7,
              }}
            >
              No chat found
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
}
