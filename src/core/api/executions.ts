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
      getExecutionById: build.query<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}`,
          method: "get",
        }),
      }),
      getTemplatesExecutionsByMe: build.query<TemplateExecutionsDisplay[], void>({
        query: () => ({
          url: `/api/meta/template-executions/me`,
          method: "get",
        }),
      }),
      putExecutionTitle: build.mutation<TemplatesExecutions, { id: number; data: ITemplateExecutionPut }>({
        query: ({ id, data }: { id: number; data: ITemplateExecutionPut }) => ({
          url: `/api/meta/template-executions/${id}/`,
          method: "patch",
          headers: { "Content-Type": "application/json" },
          data,
        }),
        invalidatesTags: ["Executions"],
      }),
    };
  },
});

export const {
  useGetExecutionByIdQuery,
  useGetExecutionsByTemplateQuery,
  useGetTemplatesExecutionsByMeQuery,
  usePutExecutionTitleMutation,
} = executionsApi;
