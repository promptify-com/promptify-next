import { Templates } from "./dto/templates";
import { baseApi } from "./api";

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getCollections: builder.query<Templates[], void>({
        query: () => {
          return {
            url: " /api/meta/collections/",
            method: "get",
          };
        },
      }),
      getCollectionTemplates: builder.query<any, number>({
        query: (id: number) => ({
          url: `/api/meta/collections/${id}`,
          method: "get",
        }),
      }),
    };
  },
});

export const { useGetCollectionsQuery, useGetCollectionTemplatesQuery } =
  collectionsApi;
