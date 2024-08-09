import { baseApi } from "./api";
import { IPagination, IPaginateParams } from "./dto";
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

const getSearchParams = (params: IPaginateParams) => {
  const searchParams = new URLSearchParams();

  params.limit && searchParams.append("limit", String(params.limit));
  (params.offset || params.offset === 0) && searchParams.append("offset", String(params.offset));

  return searchParams.toString();
};

export const chatsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getChats: builder.query<IPagination<IChat>, IPaginateParams>({
        query: (params: IPaginateParams) => ({
          url: `/api/chat/chats?${getSearchParams(params)}`,
          method: "get",
          providesTags: ["Chats"],
        }),
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
          data: {
            title: data.title,
            thumbnail: data.thumbnail,
          },
        }),
      }),
      deleteChat: builder.mutation({
        query: (id: number) => ({
          url: `/api/chat/chats/${id}`,
          method: "delete",
        }),
      }),
      updateChat: builder.mutation<IChat, { id: number; data: IChatPartial }>({
        query: ({ id, data }: { data: IChatPartial; id: number }) => ({
          url: `/api/chat/chats/${id}`,
          method: "put",
          data,
        }),
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
      saveChatSuggestionsTemplates: builder.mutation<void, ISaveChatSuggestions>({
        query: ({ chat, text, templates }) => ({
          url: "/api/chat/templates_suggestions/",
          method: "POST",
          data: {
            chat,
            text,
            templates,
          },
        }),
      }),
      saveChatSuggestionsWorkflows: builder.mutation<void, ISaveChatSuggestions>({
        query: ({ chat, text, workflows }) => ({
          url: "/api/chat/workflows_suggestions/",
          method: "POST",
          data: {
            chat,
            text,
            workflows,
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
      getSuggestions: builder.query<any, void>({
        query: () => ({
          url: "/api/chat/suggestions-queries",
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
  useSaveChatInputMutation,
  useSaveChatSuggestionsTemplatesMutation,
  useSaveChatSuggestionsWorkflowsMutation,
  useSaveChatExecutionsMutation,
  useSaveChatTemplateMutation,
  useBatchingMessagesMutation,
  useGetChatMessagesQuery,
  useGetSuggestionsQuery,
} = chatsApi;
