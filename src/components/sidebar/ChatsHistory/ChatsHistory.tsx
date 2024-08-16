import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChatCard } from "@/components/common/cards/CardChat";
import SearchField from "@/components/common/forms/SearchField";
import { memo, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setInitialChat, setSelectedChat, initialState as initialChatState, setChats } from "@/core/store/chatSlice";
import { IChat } from "@/core/api/dto/chats";
import { ChatCardPlaceholder } from "@/components/placeholders/ChatCardPlaceholder";
import { useRouter } from "next/router";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { useChatsPaginator } from "@/components/Chat/Hooks/useChatsPaginator";

interface Props {
  onClose?: () => void;
}

function ChatsHistory({ onClose }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { chats, selectedChat } = useAppSelector(state => state.chat ?? initialChatState);
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

  const handleNewChat = () => {
    if (!currentUser?.id) {
      return router.push("/signin");
    }

    const newLocalChat: IChat = {
      id: Date.now(),
      title: "Welcome",
      created_at: new Date().toISOString(),
      thumbnail: "",
      updated_at: new Date().toISOString(),
    };
    const updatedChats = [newLocalChat, ...(chats || [])];
    dispatch(setChats(updatedChats));
    handleClickChat(newLocalChat);
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
          query: { ch_o: router.query.ch_o },
        },
        undefined,
        { scroll: false, shallow: true },
      );
    }
  }, [router, loadedChats]);

  const filteredChats = useMemo(() => {
    return search.length >= 2 ? chats?.filter(chat => chat.title.toLowerCase().indexOf(search) > -1) : chats;
  }, [search, chats]);

  const emptyChats = filteredChats?.length === 0;
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
          Last 30 days:
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
            {filteredChats.map((chat, index) => (
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

export default memo(ChatsHistory);
