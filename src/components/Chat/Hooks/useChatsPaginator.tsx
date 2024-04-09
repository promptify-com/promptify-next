import { useEffect, useState } from "react";
import { useGetChatsQuery } from "@/core/api/chats";
import { IChat } from "@/core/api/dto/chats";

const PAGINATION_LIMIT = 10;

export function useChatsPaginator() {
  const [offset, setOffset] = useState(0);
  const [chats, setChats] = useState<IChat[]>([]);

  const {
    data: fetchedChats,
    isLoading: isChatsLoading,
    isFetching: isChatsFetching,
  } = useGetChatsQuery({ limit: PAGINATION_LIMIT, offset });

  useEffect(() => {
    if (fetchedChats?.results) {
      setChats(prevTemplates => prevTemplates.concat(fetchedChats?.results));
    }
  }, [fetchedChats?.results]);

  const handleNextPage = () => {
    if (!!fetchedChats?.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };

  const hasMore = !!fetchedChats?.next;

  return {
    chats,
    isChatsLoading,
    isChatsFetching,
    hasMore,
    handleNextPage,
  };
}
