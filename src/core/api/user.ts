import { User } from "./dto/user";
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
      updateUserProfile: builder.mutation<User, any>({
        query: ({
          updatedUser,
          token,
        }: {
          updatedUser: any;
          token: string;
        }) => ({
          url: "/api/me/",
          method: "patch",
          headers: {
            Authorization: `Token ${token}`,
          },
          data: updatedUser,
        }),
      }),
    };
  },
});

export const { useGetCurrentUserQuery, useUpdateUserProfileMutation } = userApi;
