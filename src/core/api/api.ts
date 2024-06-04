import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_REQUEST_RETRIES!) || 3,
    retryDelay: parseInt(process.env.NEXT_PUBLIC_REQUEST_RETRY_DELAY!) || 1000, // in milliseconds
  }),
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
    "Chats",
    "Workflow",
  ],
  endpoints: () => ({}),
});
