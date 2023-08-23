import { CollectionMutationParams, Templates } from "./dto/templates";
import { baseApi } from "./api";

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getCollectionTemplates: builder.query<any, number>({
        query: (id: number) => ({
          url: `/api/meta/collections/${id}`,
          method: "get",
        }),
        providesTags: ["Collections"],
      }),
      addToCollection: builder.mutation<void, CollectionMutationParams>({
        query: options => ({
          url: `/api/meta/collections/${options.collectionId}/add/${options.templateId}/`,
          method: "post",
        }),
        invalidatesTags: ["Collections"],
      }),
      removeFromCollection: builder.mutation<void, CollectionMutationParams>({
        query: options => ({
          url: `/api/meta/collections/${options.collectionId}/remove/${options.templateId}/`,
          method: "post",
        }),
        invalidatesTags: ["Collections"],
      }),
    };
  },
});

export const { useGetCollectionTemplatesQuery, useAddToCollectionMutation, useRemoveFromCollectionMutation } =
  collectionsApi;
