import { useEffect, useState } from "react";
import { useGetChatsQuery } from "@/core/api/chats";
import { useRouter } from "next/router";
import { CHATS_LIST_PAGINATION_LIMIT } from "@/components/Chat/Constants";

export function useChatsPaginator() {
  const router = useRouter();
  const [offset, setOffset] = useState(0);

  const {
    data: fetchedChats,
    isLoading: isChatsLoading,
    isFetching: isChatsFetching,
  } = useGetChatsQuery({ limit: CHATS_LIST_PAGINATION_LIMIT, offset });

  useEffect(() => {
    router.replace({ pathname: router.pathname, query: { ...router.query, ch_o: 0 } }, undefined, {
      shallow: true,
    });
  }, []);

  const handleNextPage = () => {
    if (!!fetchedChats?.next) {
      setOffset(prevOffset => {
        const nextOffset = prevOffset + CHATS_LIST_PAGINATION_LIMIT;

        router.replace({ pathname: router.pathname, query: { ...router.query, ch_o: nextOffset } }, undefined, {
          shallow: true,
        });

        return nextOffset;
      });
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
