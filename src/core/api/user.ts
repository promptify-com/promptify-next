import { User, UpdateUserData, UserProfile } from "./dto/user";
import { baseApi } from "./api";
import { Templates } from "./dto/templates";

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
      getUserTemplates: builder.query<Templates[], any>({
        query: (username: string) => ({
          url: `/api/meta/users/${username}/templates/`,
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
