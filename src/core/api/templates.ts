import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { HYDRATE } from "next-redux-wrapper";

import { FilterParams, Templates } from "./dto/templates";
import { axiosBaseQuery } from "./axios-base-query";

export const templatesApi = createApi({
  reducerPath: "templatesApi",
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
    };
  },
});

export const { useGetTemplatesByOrderingQuery } = templatesApi;
