import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";
import { HYDRATE } from "next-redux-wrapper";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_REQUEST_RETRIES!) || 3,
    retryDelay: parseInt(process.env.NEXT_PUBLIC_REQUEST_RETRY_DELAY!) || 1000, // in milliseconds
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: [
    "Templates",
    "Categories",
    "Collections",
    "User",
    "Tags",
    "Engines",
    "Sparks",
    "MyTemplates",
    "Executions",
    "Parameters",
    "ParametersPresets",
    "Deployments",
    "Feedbacks",
    "PromptsExecutions",
  ],
  endpoints: () => ({}),
});
