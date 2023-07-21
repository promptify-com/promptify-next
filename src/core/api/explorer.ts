import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axios-base-query";
import {
  Templates,
  Tag,
  Category,
  Engine,
  TemplateIds,
  TemplateKeyWordTag,
  FilterParams,
} from "./dto/templates";

export const explorerApi = createApi({
  reducerPath: "explorerApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  }),
  endpoints: (builder) => {
    return {
      getTags: builder.query<Tag[], void>({
        query: () => ({
          url: `/api/meta/tags`,
          method: "get",
        }),
      }),

      getTagsPopular: builder.query<Tag[], void>({
        query: () => ({
          url: `/api/meta/tags/popular/`,
          method: "get",
        }),
      }),

      getCategories: builder.query<Category[], void>({
        query: () => ({
          url: `/api/meta/categories/`,
          method: "get",
        }),
      }),

      getTemplatesByKeyWord: builder.query<Templates[], string>({
        query: (title: string) => ({
          url: `/api/meta/templates/?title=${title}`,
          method: "get",
        }),
      }),

      getTemplatesByKeyWordAndTag: builder.query<
        Templates[],
        TemplateKeyWordTag
      >({
        query: (param: TemplateKeyWordTag) => ({
          url:
            "/api/meta/templates/?ordering=runs" +
            (!!param.keyword ? `&title=${param.keyword}` : "") +
            (!!param.tag ? `&${param.tag}` : ""),
          method: "get",
        }),
      }),

      getCollections: builder.query<Templates[], void>({
        query: () => {
          return {
            url: " /api/meta/collections/",
            method: "get",
          };
        },
      }),

      getTemplatesByTag: builder.query<Templates[], string>({
        query: (tag: string) => ({
          url: `/api/meta/templates/?tag=${tag}`,
          method: "get",
        }),
      }),

      getTemplatesByOrdering: builder.query<Templates[], void>({
        query: () => ({
          url: `/api/meta/templates/?ordering=-runs`,
          method: "get",
        }),
      }),

      getTemplatesByFilter: builder.query<Templates[], FilterParams>({
        query: (params: FilterParams) => ({
          url:
            "/api/meta/templates/?" +
            (params.tag ? `&tag=${params.tag}` : "") +
            (params.categoryId ? `main_category_id=${params.categoryId}` : "") +
            (params.subcategoryId
              ? `&sub_category_id=${params.subcategoryId}`
              : "") +
            (params.engineId ? `&engine=${params.engineId}` : "") +
            (params.filter ? `&ordering=${params.filter}` : ""),
          method: "get",
        }),
      }),

      getTemplatesByCategory: builder.query<Templates[], string>({
        query: (id: string) => ({
          url: `/api/meta/templates/?main_category_id=${id}`,
          method: "get",
        }),
      }),

      getTemplatesByEngineCategorySubcategory: builder.query<
        Templates[],
        TemplateIds
      >({
        query: (ids: TemplateIds) => ({
          url:
            "/api/meta/templates/?" +
            (ids.categoryId ? `main_category_id=${ids.categoryId}` : "") +
            (ids.subcategoryId ? `&sub_category_id=${ids.subcategoryId}` : "") +
            (ids.engineId ? `&engine=${ids.engineId}` : ""),
          method: "get",
        }),
      }),

      getTemplatesByEngine: builder.query<Templates[], string>({
        query: (id: string) => ({
          url: `/api/meta/templates/?engine=${id}`,
          method: "get",
        }),
      }),

      getEngines: builder.query<Engine[], void>({
        query: () => ({
          url: `/api/meta/engines`,
          method: "get",
        }),
      }),

      getCategoryBySlug: builder.query<Category, string>({
        query: (slug: string) => ({
          url: `/api/meta/categories/by-slug/${slug}`,
          method: "get",
        }),
      }),
    };
  },
});

export const {
  useGetTagsQuery,
  useGetTagsPopularQuery,
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetTemplatesByKeyWordQuery,
  useGetTemplatesByTagQuery,
  useGetTemplatesByKeyWordAndTagQuery,
  useLazyGetTemplatesByKeyWordAndTagQuery,
  useGetTemplatesByOrderingQuery,
  useGetTemplatesByCategoryQuery,
  useGetTemplatesByEngineQuery,
  useGetEnginesQuery,
  useGetTemplatesByEngineCategorySubcategoryQuery,
  useLazyGetTemplatesByFilterQuery,
  useGetTemplatesByFilterQuery,
  useGetCollectionsQuery,
  useLazyGetCollectionsQuery,
} = explorerApi;
