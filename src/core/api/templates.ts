import { baseApi } from "./api";
import { PromptParams } from "./dto/prompts";
import {
  FilterParams,
  IFeedback,
  IPostFeedback,
  TemplateApiStatus,
  Templates,
  TemplatesWithPagination,
} from "./dto/templates";
import { IEditTemplate } from "@/common/types/editTemplate";
import { randomId } from "@/common/helpers";

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
      deletePrompt: builder.mutation({
        query: (id: number) => ({
          url: `/api/meta/prompts/${id}`,
          method: "delete",
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
      getsuggestedTemplatesByCategory: builder.query<Templates[], void>({
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
    };
  },
});

export const {
  useGetTemplatesSuggestedQuery,
  useDeleteTemplateMutation,
  useGetTemplatesByFilterQuery,
  useGetTemplatesBySearchQuery,
  useGetPromptParamsQuery,
  useDeletePromptMutation,
  useGetPromptTemplateBySlugQuery,
  useGetPromptTemplatesQuery,
  useGetMyTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  usePublishTemplateMutation,
  useViewTemplateMutation,
  useGetsuggestedTemplatesByCategoryQuery,
  useGetFeedbacksQuery,
  useSaveFeedbackMutation,
  useSetTemplateEnableApiMutation,
  useGetTemplateApiStatusQuery,
} = templatesApi;
