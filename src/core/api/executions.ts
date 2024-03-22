import { baseApi } from "./api";
import type {
  ITemplateExecutionPut,
  ResponseType,
  TemplateExecutionsDisplay,
  Templates,
  TemplatesExecutions,
} from "./dto/templates";

// TODO: Optimistic updates for invalidatesTags: ["Executions"] very heavy request
export const executionsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getExecutionsByTemplate: builder.query<TemplatesExecutions[], number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/executions/`,
          method: "get",
        }),
        providesTags: ["Executions"],
      }),
      getTemplatesExecutionsByMe: builder.query<TemplateExecutionsDisplay[], number | undefined>({
        query: limit => ({
          url: `/api/meta/template-executions/me/${limit ? `?limit=${limit}` : ""}`,
          method: "get",
        }),
        providesTags: ["Executions"],
      }),
      getLatestExecutedTemplates: builder.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/last_executed",
          method: "get",
        }),
      }),
      exportExecution: builder.query<ResponseType, { id: number; fileType: "word" | "pdf" }>({
        query: ({ id, fileType }: { id: number; fileType: "word" | "pdf" }) => ({
          url: `/api/meta/template-executions/${id}/export/?file_format=${fileType}`,
          method: "get",
          headers: { "Content-Type": fileType === "pdf" ? "application/pdf" : "application/msword" },
          responseType: "arraybuffer",
          keepUnusedDataFor: 1,
        }),
      }),
      updateExecution: builder.mutation<TemplatesExecutions, { id: number; data: ITemplateExecutionPut }>({
        query: ({ id, data }) => ({
          url: `/api/meta/template-executions/${id}/`,
          method: "patch",
          data,
        }),
        invalidatesTags: ["Executions"],
      }),
      deleteExecution: builder.mutation<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}/`,
          method: "delete",
        }),
        invalidatesTags: ["Executions"],
      }),
      executionFavorite: builder.mutation<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}/favorite/`,
          method: "post",
        }),
        invalidatesTags: ["Executions"],
      }),
      deleteExecutionFavorite: builder.mutation<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}/favorite/`,
          method: "delete",
        }),
        invalidatesTags: ["Executions"],
      }),
      stopExecution: builder.mutation<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}/stop/`,
          method: "post",
        }),
        invalidatesTags: ["Executions"],
      }),
    };
  },
});

export const {
  useGetExecutionsByTemplateQuery,
  useExportExecutionQuery,
  useGetTemplatesExecutionsByMeQuery,
  useUpdateExecutionMutation,
  useDeleteExecutionMutation,
  useDeleteExecutionFavoriteMutation,
  useExecutionFavoriteMutation,
  useStopExecutionMutation,
  useGetLatestExecutedTemplatesQuery,
} = executionsApi;
