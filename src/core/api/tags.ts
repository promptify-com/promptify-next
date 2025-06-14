import { Tag } from "./dto/templates";
import { baseApi } from "./api";

export const tagsApi = baseApi.injectEndpoints({
  endpoints: builder => {
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
        keepUnusedDataFor: 60 * 60,
        transformResponse: (response: Tag[]) => response.map(tag => ({ ...tag, type: "tag" })),
      }),
    };
  },
});

export const { useGetTagsQuery, useGetTagsPopularQuery } = tagsApi;
