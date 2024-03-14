import { baseApi } from "./api";
import { IChat, IChatPartial, ISaveChatInput } from "./dto/chats";

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
      createChat: builder.mutation<IChat, IChatPartial>({
        query: (data: IChat) => ({
          url: `/api/chat/chats`,
          method: "post",
          data,
        }),
        async onQueryStarted(chat, { dispatch, queryFulfilled }) {
          try {
            const newChat = await queryFulfilled;
            dispatch(
              chatsApi.util.updateQueryData("getChats", undefined, _chats => {
                _chats.unshift(newChat.data);
                return _chats;
              }),
            );
          } catch {}
        },
      }),
      deleteChat: builder.mutation({
        query: (id: number) => ({
          url: `/api/chat/chats/${id}`,
          method: "delete",
        }),
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            chatsApi.util.updateQueryData("getChats", undefined, _chats => {
              return _chats.filter(chat => chat.id !== id);
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),
      updateChat: builder.mutation<IChat, { id: number; data: IChatPartial }>({
        query: ({ id, data }: { data: IChatPartial; id: number }) => ({
          url: `/api/chat/chats/${id}`,
          method: "put",
          data,
        }),
        async onQueryStarted({ id: chatId, data: chatData }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            chatsApi.util.updateQueryData("getChats", undefined, _chats => {
              return _chats.map(_chat => ({
                id: _chat.id,
                created_at: _chat.created_at,
                updated_at: new Date().toISOString(),
                ...(_chat.id === chatId ? chatData : _chat),
              }));
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),
      duplicateChat: builder.mutation<IChat, number>({
        query: (id: number) => ({
          url: `/api/chat/chats/${id}/duplicate`,
          method: "post",
        }),
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          try {
            const newChat = await queryFulfilled;
            dispatch(
              chatsApi.util.updateQueryData("getChats", undefined, _chats => {
                _chats.unshift(newChat.data);
                return _chats;
              }),
            );
          } catch {}
        },
      }),
      saveChatInput: builder.mutation<void, ISaveChatInput>({
        query: ({ chat, text, type, sender }) => ({
          url: "/api/chat/inputs/",
          method: "POST",
          data: {
            chat,
            text,
            type,
            sender,
          },
        }),
      }),
      saveChatSuggestions: builder.mutation<void, { chat: number; templates: number[] }>({
        query: ({ chat, templates }) => ({
          url: "/api/chat/suggestions/",
          method: "POST",
          data: {
            chat,
            templates,
          },
        }),
      }),
      saveChatExecutions: builder.mutation<void, { chat: number; execution: number }>({
        query: ({ chat, execution }) => ({
          url: "/api/chat/executions/",
          method: "POST",
          data: {
            chat,
            execution,
          },
        }),
      }),
    };
  },
});

export const {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useDeleteChatMutation,
  useUpdateChatMutation,
  useDuplicateChatMutation,
  useSaveChatInputMutation,
  useSaveChatSuggestionsMutation,
  useSaveChatExecutionsMutation,
} = chatsApi;
