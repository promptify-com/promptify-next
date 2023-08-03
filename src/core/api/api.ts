// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";
import { HYDRATE } from "next-redux-wrapper";

// initialize an empty api service that we'll inject endpoints into later as needed
export const globalApi = createApi({
  reducerPath: "splitApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
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
    "Prompts",
    "User",
    "Tags",
    "Engines",
  ],
  endpoints: () => ({}),
});
