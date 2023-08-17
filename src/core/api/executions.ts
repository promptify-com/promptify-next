import { baseApi } from "./api";
import {
  TemplateExecutionsDisplay,
  TemplatesExecutions,
} from "./dto/templates";

export const executionsApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      getExecutionsByTemplate: build.query<TemplatesExecutions[], number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/executions/`,
          method: "get",
        }),
        providesTags: ["Executions"]
      }),
      getExecutionById: build.query<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}`,
          method: "get",
        }),
      }),
      getTemplatesExecutionsByMe: build.query<
        TemplateExecutionsDisplay[],
        void
      >({
        query: () => ({
          url: `/api/meta/template-executions/me`,
          method: "get",
        }),
      })
    };
  },
});

export const {
  useGetExecutionByIdQuery,
  useGetExecutionsByTemplateQuery,
  useGetTemplatesExecutionsByMeQuery,
} = executionsApi;