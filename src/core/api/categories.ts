import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { Category } from "./dto/templates";
import { axiosBaseQuery } from "./axios-base-query";
import { HYDRATE } from "next-redux-wrapper";

export const CategoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (build) => {
    return {
      getCategories: build.query<Category[], void>({
        query: () => ({
          url: `/api/meta/categories`,
          method: "get",
        }),
      }),
      getCategoryById: build.query<Category, number>({
        query: (id: number) => ({
          url: `/api/meta/categories/${id}`,
          method: "get",
        }),
      }),
      //   works for subcategory slug as well
      getCategoryBySlug: build.query<Category, string>({
        query: (slug: string) => ({
          url: `/api/meta/categories/by-slug/${slug}`,
          method: "get",
        }),
      }),
    };
  },
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
} = CategoriesApi;
