import { baseApi } from "./api";
import { ITemplateExecutionPut, TemplateExecutionsDisplay, TemplatesExecutions } from "./dto/templates";

export const executionsApi = baseApi.injectEndpoints({
  endpoints: build => {
    return {
      getExecutionsByTemplate: build.query<TemplatesExecutions[], number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/executions/`,
          method: "get",
        }),
        providesTags: ["Executions"],
      }),
      getTemplatesExecutionsByMe: build.query<TemplateExecutionsDisplay[], void>({
        query: () => ({
          url: `/api/meta/template-executions/me`,
          method: "get",
        }),
        providesTags: ["Executions"],
      }),
      updateExecution: build.mutation<TemplatesExecutions, { id: number; data: ITemplateExecutionPut }>({
        query: ({ id, data }: { id: number; data: ITemplateExecutionPut }) => ({
          url: `/api/meta/template-executions/${id}/`,
          method: "patch",
          data,
        }),
        invalidatesTags: ["Executions"],
      }),
      deleteExecution: build.mutation<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}/`,
          method: "delete",
        }),
        invalidatesTags: ["Executions"],
      }),
      executionFavorite: build.mutation<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}/favorite/`,
          method: "post",
        }),
        invalidatesTags: ["Executions"],
      }),
    };
  },
});

export const {
  useGetExecutionsByTemplateQuery,
  useGetTemplatesExecutionsByMeQuery,
  useUpdateExecutionMutation,
  useDeleteExecutionMutation,
  useExecutionFavoriteMutation,
} = executionsApi;
