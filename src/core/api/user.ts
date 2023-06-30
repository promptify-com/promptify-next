import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axios-base-query";
import { User } from "./dto/user";
import useToken from "../../hooks/useToken";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  }),
  endpoints: (builder) => {
    const token = useToken();

    return {
      getCurrentUser: builder.query<User, any>({
        query: () => ({
          url: "/api/me/",
          method: "get",
          headers: {
            Authorization: `Token ${token}`,
          },
        }),
      }),
    };
  },
});

export const { useGetCurrentUserQuery } = userApi;
