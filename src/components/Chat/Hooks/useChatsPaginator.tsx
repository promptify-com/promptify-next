import { useEffect, useState } from "react";
import { useGetChatsQuery } from "@/core/api/chats";
import { useRouter } from "next/router";
import { CHATS_LIST_PAGINATION_LIMIT } from "@/components/Chat/Constants";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { initialState, setChats } from "@/core/store/chatSlice";
import { isValidUserFn } from "@/core/store/userSlice";

export function useChatsPaginator() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const [offset, setOffset] = useState(0);
  const chats = useAppSelector(state => state.chat?.chats ?? initialState.chats);

  const {
    data: fetchedChats,
    isLoading: isChatsLoading,
    isFetching: isChatsFetching,
  } = useGetChatsQuery({ limit: CHATS_LIST_PAGINATION_LIMIT, offset }, { skip: !isValidUser });

  useEffect(() => {
    router.replace({ pathname: router.pathname, query: { ...router.query, ch_o: 0 } }, undefined, {
      shallow: true,
    });
  }, []);

  useEffect(() => {
    if (!fetchedChats?.results?.length) {
      return;
    }
    dispatch(setChats(chats.concat(fetchedChats?.results)));

    return () => {
      dispatch(setChats([]));
    };
  }, [fetchedChats?.results]);

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
    isChatsLoading,
    isChatsFetching,
    hasMore,
    handleNextPage,
  };
}
