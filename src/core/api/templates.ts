import { baseApi } from "./api";
import { PromptParams } from "./dto/prompts";
import {
  FilterParams,
  IFeedback,
  IPostFeedback,
  TemplateApiStatus,
  Templates,
  TemplatesWithPagination,
  IPromptExecution,
} from "./dto/templates";
import { IEditTemplate } from "@/common/types/editTemplate";
import { randomId } from "@/common/helpers";
import { IEditPrompts } from "@/common/types/builder";

const getSearchParams = (params: FilterParams) => {
  const searchParams = new URLSearchParams();
  params.categoryId && searchParams.append("main_category_id", String(params.categoryId));
  params.tags?.length && params.tags.forEach(tag => searchParams.append("tag", tag.name));
  params.subcategoryId && searchParams.append("sub_category_id", String(params.subcategoryId));
  params.engineId && searchParams.append("engine", String(params.engineId));
  params.title && searchParams.append("title", params.title);
  params.ordering && searchParams.append("ordering", params.ordering);
  params.limit && searchParams.append("limit", String(params.limit));
  params.offset && searchParams.append("offset", String(params.offset));
  params.status && searchParams.append("status", String(params.status));
  params.engine_type && searchParams.append("engine_type", String(params.engine_type));
  params.isFavourite && searchParams.append("is_favorite", String(params.isFavourite));
  typeof params.isInternal === "boolean" && searchParams.append("is_internal", String(params.isInternal));

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
        query: params => {
          return {
            url: `/api/meta/templates?${getSearchParams(params)}`,
            method: "get",
          };
        },
      }),
      deleteTemplate: builder.mutation({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}`,
          method: "delete",
        }),
        invalidatesTags: ["Templates", "MyTemplates"],
      }),
      addTemplateLike: builder.mutation({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/like`,
          method: "post",
        }),
      }),
      removeTemplateLike: builder.mutation({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/like`,
          method: "delete",
        }),
      }),
      getTemplateById: builder.query<Templates, number>({
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
      deletePrompt: builder.mutation({
        query: (id: number) => ({
          url: `/api/meta/prompts/${id}`,
          method: "delete",
        }),
      }),
      updatePrompt: builder.mutation<IEditPrompts, { id: number; data: IEditPrompts }>({
        query: ({ id, data }: { data: IEditPrompts; id: number }) => ({
          url: `/api/meta/prompts/${id}`,
          method: "put",
          data,
        }),
      }),
      getMyTemplates: builder.query<Templates[] | TemplatesWithPagination, FilterParams>({
        query: (params = {}) => ({
          url: `/api/meta/templates/me${Object.keys(params).length ? `?${getSearchParams(params)}` : ""}`,
          method: "get",
          refetchOnMountOrArgChange: true,
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
      getSuggestedTemplatesByCategory: builder.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/suggested_by_category",
          method: "get",
        }),
      }),
      getFeedbacks: builder.query<IFeedback[], number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/feedbacks/`,
          method: "get",
          keepUnusedDataFor: 900,
        }),
        providesTags: ["Feedbacks"],
      }),
      saveFeedback: builder.mutation<IFeedback, IPostFeedback>({
        query: (data: IPostFeedback) => ({
          url: `/api/meta/feedbacks/`,
          method: "post",
          data: { template: data.template, comment: data.comment },
        }),
        async onQueryStarted(feedback, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            templatesApi.util.updateQueryData("getFeedbacks", feedback.template, feedbacks => {
              return feedbacks.concat({
                user: feedback.user,
                template: feedback.template,
                id: randomId(),
                status: "published",
                created_at: new Date().toISOString(),
                comment: feedback.comment,
              });
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),
      getTemplateApiStatus: builder.query<TemplateApiStatus, number>({
        query: id => ({
          url: `/api/meta/templates/${id}/enable-api`,
          keepUnusedDataFor: 604800,
          method: "get",
        }),
      }),
      setTemplateEnableApi: builder.mutation<void, number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/enable-api`,
          method: "post",
        }),
      }),
      getPromptExecutions: builder.query<IPromptExecution[], number>({
        query: id => ({
          url: `/api/meta/templates/${id}/prompt-executions`,
          method: "get",
        }),
        providesTags: ["PromptsExecutions"],
      }),
      deletePromptExecutions: builder.mutation({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/prompt-executions`,
          method: "delete",
        }),
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            templatesApi.util.updateQueryData("getPromptExecutions", id, _ => {
              return [];
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),
      createPrompt: builder.mutation<IEditPrompts, IEditPrompts>({
        query: (data: IEditPrompts) => ({
          url: `/api/meta/prompts/`,
          method: "post",
          data,
        }),
      }),
    };
  },
});

export const {
  useGetTemplatesSuggestedQuery,
  useDeleteTemplateMutation,
  useAddTemplateLikeMutation,
  useRemoveTemplateLikeMutation,
  useUpdatePromptMutation,
  useGetTemplatesByFilterQuery,
  useGetTemplatesBySearchQuery,
  useGetPromptParamsQuery,
  useDeletePromptMutation,
  useGetPromptTemplateBySlugQuery,
  useGetTemplateByIdQuery,
  useGetMyTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  usePublishTemplateMutation,
  useViewTemplateMutation,
  useGetSuggestedTemplatesByCategoryQuery,
  useGetFeedbacksQuery,
  useSaveFeedbackMutation,
  useSetTemplateEnableApiMutation,
  useGetTemplateApiStatusQuery,
  useGetPromptExecutionsQuery,
  useDeletePromptExecutionsMutation,
  useCreatePromptMutation,
} = templatesApi;
