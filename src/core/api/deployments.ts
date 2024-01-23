import { baseApi } from "./api";
import type {
  Deployment,
  Instance,
  Model,
  PaginationData,
  Region,
  RegionParams,
  FilterParams,
} from "@/common/types/deployments";

const getSearchParams = (params: FilterParams) => {
  const searchParams = new URLSearchParams();

  params.limit && searchParams.append("limit", String(params.limit));
  params.offset && searchParams.append("offset", String(params.offset));
  params.query && searchParams.append("query", String(params.query));
  params.region && searchParams.append("region", String(params.region));

  return searchParams.toString();
};

export const deploymentsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getRegions: builder.query<Region[], RegionParams>({
        query: (params: RegionParams) => {
          const queryParams = new URLSearchParams();
          if (params.provider) {
            queryParams.append("provider", params.provider);
          }

          return {
            url: `/api/aithos/regions/?${queryParams.toString()}`,
            method: "get",
          };
        },
        keepUnusedDataFor: 60 * 60,
      }),

      getPaginatedData: builder.query<PaginationData<Model | Instance>, FilterParams>({
        query: ({ limit, offset, query, type, region }: FilterParams) => {
          const params = getSearchParams({ limit, offset, query, region });

          return {
            url: type === "models" ? `/api/aithos/models/?${params}` : `/api/aithos/instances/?${params}`,
            method: "get",
          };
        },
        keepUnusedDataFor: 60 * 30,
      }),

      getDeployments: builder.query<Deployment[], void>({
        query: () => ({
          url: `/api/aithos/deployments`,
          method: "get",
        }),
        keepUnusedDataFor: 60 * 15,
        providesTags: ["Deployments"],
      }),

      deleteDeployment: builder.mutation({
        query: (id: number) => ({
          url: `/api/aithos/deployments/${id}/`,
          method: "delete",
        }),
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            deploymentsApi.util.updateQueryData("getDeployments", undefined, deploymentsDraft => {
              return deploymentsDraft.filter(deployment => deployment.id !== id);
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),
    };
  },
});

export const { useGetRegionsQuery, useGetDeploymentsQuery, useDeleteDeploymentMutation, useGetPaginatedDataQuery } =
  deploymentsApi;
