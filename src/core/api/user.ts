import { baseApi } from "@/core/api/api";
import type { User, UpdateUserData, UserProfile, UpdateUserPreferences, UserPreferences } from "@/core/api/dto/user";
import type { TemplatesWithPagination } from "@/core/api/dto/templates";

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
      updateUserPreferences: builder.mutation<UserPreferences, { username: String; data: UpdateUserPreferences }>({
        query: ({ username, data }) => ({
          url: `/api/meta/users/${username}/preferences`,
          method: "put",
          data,
        }),
      }),

      getUserDetails: builder.query<UserProfile, any>({
        query: (username: string) => ({
          url: `/api/meta/users/${username}/`,
          method: "get",
        }),
      }),
      getUserTemplates: builder.query<TemplatesWithPagination, { username: string; limit: number; offset: number }>({
        query: ({ username, offset, limit }) => ({
          url: `/api/meta/users/${username}/templates/?limit=${limit}&offset=${offset}`,
          method: "get",
        }),
      }),
      deleteUser: builder.mutation<void, string>({
        query: (token: string) => ({
          url: "/api/me/",
          method: "delete",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    };
  },
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPreferencesMutation,
  useGetUserDetailsQuery,
  useGetUserTemplatesQuery,
  useDeleteUserMutation,
} = userApi;
