import useDeferredAction from "@/hooks/useDeferredAction";
import { baseApi } from "./api";
import { PromptParams } from "./dto/prompts";
import {
  FilterParams,
  TemplateExecutionsDisplay,
  Templates,
  TemplatesExecutions,
} from "./dto/templates";
import { authClient } from "@/common/axios";

export const templatesApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      getTemplatesByOrdering: build.query<Templates[], void>({
        query: () => ({
          url: `/api/meta/templates/?ordering=-runs`,
          method: "get",
        }),
      }),
      getTemplatesSuggested: build.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/suggested",
          method: "get",
        }),
      }),
      getLastTemplates: build.query<Templates, void>({
        query: () => ({
          url: "/api/meta/templates/last_executed/",
          method: "get",
        }),
      }),
      getTemplatesByFilter: build.query<Templates[], FilterParams>({
        query: (params: FilterParams) => ({
          url:
            "/api/meta/templates/?" +
            (params.categoryId ? `main_category_id=${params.categoryId}` : "") +
            (params.tag ? `&tag=${params.tag}` : "") +
            (params.subcategoryId
              ? `&sub_category_id=${params.subcategoryId}`
              : "") +
            (params.engineId ? `&engine=${params.engineId}` : "") +
            (params.title ? `&title=${params.title}` : "") +
            (params.filter ? `&ordering=${params.filter}` : ""),
          method: "get",
        }),
      }),

      getTemplatesByCategory: build.query<Templates[], string>({
        query: (id: string) => ({
          url: `/api/meta/templates/?main_category_slug=${id}`,
          method: "get",
        }),
      }),
      getTemplateBySubCategory: build.query<Templates[], string>({
        query: (id: string) => ({
          url: `/api/meta/templates/?sub_category_slug=${id}`,
          method: "get",
        }),
      }),
      deleteTemplate: build.mutation({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}`,
          method: "delete",
        }),
        invalidatesTags: ["Templates", "MyTemplates"],
      }),
      getPromptTemplates: build.query<Templates, number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}`,
          method: "get",
        }),
      }),
      getPromptTemplateBySlug: build.query<Templates, string>({
        query: (slug: string) => ({
          url: `/api/meta/templates/by-slug/${slug}`,
          method: "get",
        }),
      }),
      getPromptParams: build.query<PromptParams[], number>({
        query: (id: number) => ({
          url: `/api/meta/prompts/${id}/params`,
          method: "get",
        }),
      }),
      getExecutionsByTemplate: build.query<TemplatesExecutions[], number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/executions/`,
          method: "get",
        }),
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
      }),
      getAllPromptTemplates: build.query<Templates[], void>({
        query: () => ({
          url: `/api/meta/templates/`,
          method: "get",
        }),
        providesTags: ["Templates"],
      }),
    };
  },
});

export const {
  useGetTemplatesByOrderingQuery,
  useGetLastTemplatesQuery,
  useGetTemplatesSuggestedQuery,
  useGetTemplateBySubCategoryQuery,
  useGetTemplatesByCategoryQuery,
  useDeleteTemplateMutation,
  useGetTemplatesByFilterQuery,
  useGetAllPromptTemplatesQuery,
  useGetExecutionByIdQuery,
  useGetExecutionsByTemplateQuery,
  useGetPromptParamsQuery,
  useGetPromptTemplateBySlugQuery,
  useGetPromptTemplatesQuery,
  useGetTemplatesExecutionsByMeQuery,
} = templatesApi;

export const useTemplateView = () => {
  return useDeferredAction(async (id: number) => {
    return await authClient.post(`/api/meta/templates/${id}/view/`);
  }, []);
};
