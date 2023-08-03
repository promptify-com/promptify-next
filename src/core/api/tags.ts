import { Tag } from "./dto/templates";
import { globalApi } from "./api";

export const tagsApi = globalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getTags: builder.query<Tag[], void>({
        query: () => ({
          url: `/api/meta/tags`,
          method: "get",
        }),
        providesTags: ["Tags"],
      }),

      getTagsPopular: builder.query<Tag[], void>({
        query: () => ({
          url: `/api/meta/tags/popular/`,
          method: "get",
        }),
      }),
    };
  },
});

export const { useGetTagsQuery, useGetTagsPopularQuery } = tagsApi;
