import { baseApi } from "./api";
import { PromptParams } from "./dto/prompts";
import { FilterParams, Templates } from "./dto/templates";
import { IEditTemplate } from "@/common/types/editTemplate";

const getSearchParams = (params: FilterParams) => {
  const searchParams = new URLSearchParams();

  params.categoryId && searchParams.append("main_category_id", String(params.categoryId));
  params.tag && searchParams.append("tag", params.tag);
  params.subcategoryId && searchParams.append("sub_category_id", String(params.subcategoryId));
  params.engineId && searchParams.append("engine", String(params.engineId));
  params.title && searchParams.append("title", params.title);
  params.ordering && searchParams.append("ordering", params.ordering);

  return searchParams.toString();
};

export const templatesApi = baseApi.injectEndpoints({
  endpoints: build => {
    return {
      getTemplatesSuggested: build.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/suggested",
          method: "get",
        }),
      }),
      getLastTemplates: build.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/last_executed/",
          method: "get",
        }),
      }),
      getTemplatesByFilter: build.query<Templates[], FilterParams>({
        query: (params: FilterParams) => ({
          url: `/api/meta/templates/?${getSearchParams(params)}`,
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
      getMyTemplates: build.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/me",
          method: "get",
        }),
        providesTags: ["MyTemplates"],
      }),
      createTemplate: build.mutation<Templates, IEditTemplate>({
        query: (data: IEditTemplate) => ({
          url: `/api/meta/templates/`,
          method: "post",
          data,
        }),
        invalidatesTags: ["Templates", "MyTemplates"],
      }),
      updateTemplate: build.mutation<Templates, { id: number; data: IEditTemplate }>({
        query: ({ data, id }: { data: IEditTemplate; id: number }) => ({
          url: `/api/meta/templates/${id}/`,
          method: "put",
          data,
        }),
        invalidatesTags: ["Templates", "MyTemplates"],
      }),
      publishTemplate: build.mutation<Templates, number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/submit/`,
          method: "post",
        }),
        invalidatesTags: ["Templates"],
      }),
      viewTemplate: build.mutation<void, number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/view/`,
          method: "post",
        }),
      }),
    };
  },
});

export const {
  useGetLastTemplatesQuery,
  useGetTemplatesSuggestedQuery,
  useDeleteTemplateMutation,
  useGetTemplatesByFilterQuery,
  useGetPromptParamsQuery,
  useGetPromptTemplateBySlugQuery,
  useGetPromptTemplatesQuery,
  useGetMyTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  usePublishTemplateMutation,
  useViewTemplateMutation,
} = templatesApi;
