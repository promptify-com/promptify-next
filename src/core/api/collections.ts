import { Templates } from "./dto/templates";
import { globalApi } from "./api";

export const collectionsApi = globalApi.injectEndpoints({
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
    };
  },
});

export const { useGetCollectionsQuery } = collectionsApi;
