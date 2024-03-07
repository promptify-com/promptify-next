import { baseApi } from "./api";
import { IChat } from "./dto/chats";

export const chatsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getChats: builder.query<IChat[], void>({
        query: () => ({
          url: `/api/chat/chats`,
          method: "get",
        }),
        providesTags: ["Chats"],
      }),
      getChatById: builder.query<IChat, number>({
        query: (id: number) => ({
          url: `/api/chat/chats/${id}/`,
          method: "get",
        }),
      }),
      createChat: builder.mutation<IChat, IChat>({
        query: (data: IChat) => ({
          url: `/api/chat/chats`,
          method: "post",
          data,
        }),
        invalidatesTags: ["Chats"],
      }),
    };
  },
});

export const { useGetChatsQuery, useGetChatByIdQuery, useCreateChatMutation } = chatsApi;
