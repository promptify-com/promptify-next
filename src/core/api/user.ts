import { User } from "./dto/user";
import useToken from "../../hooks/useToken";
import { Templates } from "./dto/templates";
import { globalApi } from "./api";

export const userApi = globalApi.injectEndpoints({
  endpoints: (builder) => {
    const token = useToken();

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
      getUserTemplates: builder.query<Templates[], void>({
        query: () => ({
          url: "/api/meta/templates/me",
          method: "get",
        }),
      }),
      updateUserProfile: builder.mutation<User, any>({
        query: (updatedUser) => ({
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

export const {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useGetUserTemplatesQuery,
} = userApi;
