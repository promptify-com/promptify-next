import { baseApi } from "./api";
import {
  BatchingRequest,
  IChat,
  IChatPartial,
  IMessagesList,
  ISaveChatExecutions,
  ISaveChatInput,
  ISaveChatSuggestions,
  ISaveChatTemplate,
} from "./dto/chats";

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
        async onQueryStarted(_id, { dispatch, queryFulfilled }) {
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
      saveChatSuggestions: builder.mutation<void, ISaveChatSuggestions>({
        query: ({ chat, text, templates }) => ({
          url: "/api/chat/suggestions/",
          method: "POST",
          data: {
            chat,
            text,
            templates,
          },
        }),
      }),
      saveChatExecutions: builder.mutation<void, ISaveChatExecutions>({
        query: ({ chat, execution, type }) => ({
          url: "/api/chat/executions/",
          method: "POST",
          data: {
            chat,
            execution,
            type,
          },
        }),
      }),
      saveChatTemplate: builder.mutation<void, ISaveChatTemplate>({
        query: ({ chat, text, template }) => ({
          url: "/api/chat/templates/",
          method: "POST",
          data: {
            chat,
            text,
            template,
          },
        }),
      }),
      batchingMessages: builder.mutation<void, BatchingRequest>({
        query: data => ({
          url: "/api/chat/chats/batching/",
          method: "POST",
          data: JSON.stringify(data),
        }),
      }),
      getChatMessages: builder.query<IMessagesList, { chat: number; cursor?: null | string }>({
        query: ({ chat, cursor = null }) => ({
          url: `/api/chat/chats/${chat}/messages${cursor ? `?cursor=${cursor}` : ""}`,
          method: "GET",
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
  useSaveChatTemplateMutation,
  useBatchingMessagesMutation,
  useGetChatMessagesQuery,
} = chatsApi;
