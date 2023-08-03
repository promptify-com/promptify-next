import { globalApi } from "./api";
import { FilterParams, Templates } from "./dto/templates";

export const templatesApi = globalApi.injectEndpoints({
  endpoints: (build) => {
    return {
      getTemplatesByOrdering: build.query<Templates[], void>({
        query: () => ({
          url: `/api/meta/templates/?ordering=-runs`,
          method: "get",
        }),
        providesTags: ["Templates"],
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
        invalidatesTags: ["Templates"],
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
} = templatesApi;
