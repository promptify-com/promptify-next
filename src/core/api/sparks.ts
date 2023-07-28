import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axios-base-query";
import { Spark } from "./dto/templates";
import useDeferredAction from "../../hooks/useDeferredAction";
import { authClient } from "../../common/axios";

export const sparksApi = createApi({
  reducerPath:  "sparksApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  }),
  endpoints: (builder) => {
    return {
      getSparksByTemplate: builder.query<Spark[], number>({
        query: (id: number) => ({
          url: `/api/meta/templates/${id}/sparks`,
          method: "get",
        }),
      })
    };
  },
});

export const {
  useGetSparksByTemplateQuery,
} = sparksApi;

export const useTemplateView = () => {
  return useDeferredAction(async (id: number) => {
    return await authClient.post(`/api/meta/templates/${id}/view/`);
  }, []);
};
