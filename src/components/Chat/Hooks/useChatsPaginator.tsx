import { useEffect, useState } from "react";
import { useGetChatsQuery } from "@/core/api/chats";
import { useAppDispatch } from "@/hooks/useStore";
import { setChats } from "@/core/store/chatSlice";

const PAGINATION_LIMIT = 10;

export function useChatsPaginator() {
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0);

  const {
    data: fetchedChats,
    isLoading: isChatsLoading,
    isFetching: isChatsFetching,
  } = useGetChatsQuery({ limit: PAGINATION_LIMIT, offset });

  useEffect(() => {
    dispatch(setChats(fetchedChats?.results ?? []));
  }, [fetchedChats?.results]);

  const handleNextPage = () => {
    if (!!fetchedChats?.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };

  const hasMore = !!fetchedChats?.next;

  return {
    chats: fetchedChats?.results ?? [],
    isChatsLoading,
    isChatsFetching,
    hasMore,
    handleNextPage,
  };
}
