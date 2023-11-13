import { baseApi } from "./api";
import type {
  Deployment,
  Instance,
  InstanceParams,
  ModelsWithPagination,
  Region,
  RegionParams,
} from "@/common/types/deployments";

export const deploymentsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getInstances: builder.query<Instance[], InstanceParams>({
        query: (params: InstanceParams) => {
          const queryParams = new URLSearchParams();
          if (params.region) {
            queryParams.append("region", params.region);
          }
          return {
            url: `/api/aithos/instances/?${queryParams.toString()}`,
            method: "get",
          };
        },
        keepUnusedDataFor: 60 * 60,
      }),

      getRegionsByQueryParams: builder.query<Region[], RegionParams>({
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

      getModels: builder.query<ModelsWithPagination, { limit: number; offset: number; query?: string }>({
        query: ({ limit, offset, query }) => {
          const queryParams = new URLSearchParams({
            limit: `${limit}`,
            offset: `${offset}`,
          });

          if (query) {
            queryParams.append("query", query);
          }

          return {
            url: `/api/aithos/models/?${queryParams.toString()}`,
            method: "get",
          };
        },
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

export const {
  useGetInstancesQuery,
  useGetRegionsByQueryParamsQuery,
  useGetDeploymentsQuery,
  useGetModelsQuery,
  useDeleteDeploymentMutation,
} = deploymentsApi;
