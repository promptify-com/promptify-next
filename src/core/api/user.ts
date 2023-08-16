import { User, UpdateUserData } from "./dto/user";
import { baseApi } from "./api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
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
      updateUserProfile: builder.mutation<User, { data: UpdateUserData, token: string }>({
        query: ({
          data,
          token,
        }) => ({
          url: "/api/me/",
          method: "put",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          data
        }),
      }),
    };
  },
});

export const { useGetCurrentUserQuery, useUpdateUserProfileMutation } = userApi;
