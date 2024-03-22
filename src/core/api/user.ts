import { baseApi } from "@/core/api/api";
import type { User, UpdateUserData, UserProfile } from "@/core/api/dto/user";
import type { Templates } from "@/core/api/dto/templates";

export const userApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getCurrentUser: builder.query<User, any>({
        query: (token: string) => ({
          url: "/api/me/",
          method: "get",
          headers: {
            Authorization: `Token ${token}`,
          },
        }),
      }),
      updateUserProfile: builder.mutation<User, { data: UpdateUserData; token: string }>({
        query: ({ data, token }) => ({
          url: "/api/me/",
          method: "put",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          data,
        }),
      }),

      getUserDetails: builder.query<UserProfile, any>({
        query: (username: string) => ({
          url: `/api/meta/users/${username}/`,
          method: "get",
        }),
      }),
      getUserTemplates: builder.query<{ results: Templates[]; count: number }, any>({
        query: (username: string) => ({
          url: `/api/meta/users/${username}/templates/?limit=10&offset=0`,
          method: "get",
        }),
      }),
    };
  },
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useGetUserDetailsQuery,
  useGetUserTemplatesQuery,
} = userApi;
