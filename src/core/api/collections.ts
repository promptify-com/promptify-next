import { CollectionMutationParams, Templates } from "./dto/templates";
import { baseApi } from "./api";
import type { ICollectionById } from "@/common/types/collection";

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getCollectionTemplates: builder.query<ICollectionById, number>({
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
