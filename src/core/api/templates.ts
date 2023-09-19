import { baseApi } from "./api";
import { PromptParams, TemplateQuestionGeneratorData } from "./dto/prompts";
import { FilterParams, Templates, TemplatesWithPagination } from "./dto/templates";
import { IEditTemplate } from "@/common/types/editTemplate";

const getSearchParams = (params: FilterParams) => {
  const searchParams = new URLSearchParams();

  params.categoryId && searchParams.append("main_category_id", String(params.categoryId));
  params.tag && searchParams.append("tag", params.tag);
  params.subcategoryId && searchParams.append("sub_category_id", String(params.subcategoryId));
  params.engineId && searchParams.append("engine", String(params.engineId));
  params.title && searchParams.append("title", params.title);
  params.ordering && searchParams.append("ordering", params.ordering);
  params.limit && searchParams.append("limit", String(params.limit));
  params.offset && searchParams.append("offset", String(params.offset));
  params.status && searchParams.append("status", String(params.status));
  params.ordering && searchParams.append("ordering", String(params.ordering));

  return searchParams.toString();
};

export const templatesApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getTemplatesSuggested: builder.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/suggested",
          method: "get",
        }),
      }),
      getTemplatesByFilter: builder.query<TemplatesWithPagination, FilterParams>({
        query: (params: FilterParams) => ({
          url: `/api/meta/templates/?${getSearchParams(params)}`,
          method: "get",
        }),
      }),
      deleteTemplate: builder.mutation({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}`,
          method: "delete",
        }),
        invalidatesTags: ["Templates", "MyTemplates"],
      }),
      getPromptTemplates: builder.query<Templates, number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}`,
          method: "get",
        }),
      }),
      getPromptTemplateBySlug: builder.query<Templates, string>({
        query: (slug: string) => ({
          url: `/api/meta/templates/by-slug/${slug}`,
          method: "get",
        }),
      }),
      getPromptParams: builder.query<PromptParams[], number>({
        query: (id: number) => ({
          url: `/api/meta/prompts/${id}/params`,
          method: "get",
        }),
      }),
      getMyTemplates: builder.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/me",
          method: "get",
        }),
        providesTags: ["MyTemplates"],
      }),
      getTemplatesBySearch: builder.query<Templates[], string>({
        query: (query: string) => ({
          url: `/api/meta/templates/search?query=${query}`,
          method: "get",
        }),
      }),
      createTemplate: builder.mutation<Templates, IEditTemplate>({
        query: (data: IEditTemplate) => ({
          url: `/api/meta/templates/`,
          method: "post",
          data,
        }),
        invalidatesTags: ["Templates", "MyTemplates"],
      }),
      updateTemplate: builder.mutation<Templates, { id: number; data: IEditTemplate }>({
        query: ({ data, id }: { data: IEditTemplate; id: number }) => ({
          url: `/api/meta/templates/${id}/`,
          method: "put",
          data,
        }),
        invalidatesTags: ["Templates", "MyTemplates"],
      }),
      publishTemplate: builder.mutation<Templates, number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/submit/`,
          method: "post",
        }),
        invalidatesTags: ["Templates"],
      }),
      viewTemplate: builder.mutation<void, number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/view/`,
          method: "post",
        }),
      }),

      templateQuestionGenerator: builder.mutation<
        Templates,
        { id?: number; data: TemplateQuestionGeneratorData; streaming?: boolean }
      >({
        query: ({
          data,
          id = 515,
          streaming = false,
        }: {
          data: TemplateQuestionGeneratorData;
          id?: number;
          streaming?: boolean;
        }) => ({
          url: `/api/meta/templates/${id}/execute/?streaming=${streaming}`,
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          data,
        }),
      }),
    };
  },
});

export const {
  useGetTemplatesSuggestedQuery,
  useDeleteTemplateMutation,
  useGetTemplatesByFilterQuery,
  useGetTemplatesBySearchQuery,
  useGetPromptParamsQuery,
  useGetPromptTemplateBySlugQuery,
  useGetPromptTemplatesQuery,
  useGetMyTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  usePublishTemplateMutation,
  useViewTemplateMutation,
  useTemplateQuestionGeneratorMutation,
} = templatesApi;
