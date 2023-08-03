import { PromptParams } from "./dto/prompts";
import {
  Templates,
  TemplatesExecutions,
  TemplateExecutionsDisplay,
} from "./dto/templates";
import useDeferredAction from "../../hooks/useDeferredAction";
import { authClient } from "../../common/axios";
import { globalApi } from "./api";

export const promptsApi = globalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getPromptTemplates: builder.query<Templates, number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}`,
          method: "get",
        }),
      }),
      getPromptTemplateBySlug: builder.query<any, string>({
        query: (slug: string) => ({
          url: `/api/meta/templates/by-slug/${slug}`,
          method: "get",
        }),
      }),
      getCollectionTemplates: builder.query<any, number>({
        query: (id: number) => ({
          url: `/api/meta/collections/${id}`,
          method: "get",
        }),
      }),
      getPromptParams: builder.query<PromptParams[], number>({
        query: (id: number) => ({
          url: `/api/meta/prompts/${id}/params`,
          method: "get",
        }),
      }),
      getExecutionsByTemplate: builder.query<TemplatesExecutions[], number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/executions/`,
          method: "get",
        }),
      }),
      getExecutionById: builder.query<TemplatesExecutions, number>({
        query: (id: number) => ({
          url: `/api/meta/template-executions/${id}`,
          method: "get",
        }),
      }),
      getTemplatesExecutionsByMe: builder.query<
        TemplateExecutionsDisplay[],
        void
      >({
        query: () => ({
          url: `/api/meta/template-executions/me`,
          method: "get",
        }),
      }),
      getAllPromptTemplates: builder.query<Templates[], void>({
        query: () => ({
          url: `/api/meta/templates/`,
          method: "get",
        }),
      }),
    };
  },
});

export const {
  useGetPromptTemplatesQuery,
  useGetPromptTemplateBySlugQuery,
  useGetCollectionTemplatesQuery,
  useGetPromptParamsQuery,
  useGetExecutionsByTemplateQuery,
  useGetExecutionByIdQuery,
  useGetTemplatesExecutionsByMeQuery,
  useGetAllPromptTemplatesQuery,
} = promptsApi;

export const useTemplateView = () => {
  return useDeferredAction(async (id: number) => {
    return await authClient.post(`/api/meta/templates/${id}/view/`);
  }, []);
};
