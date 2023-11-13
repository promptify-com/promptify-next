import { baseApi } from "./api";
import type {
  Deployment,
  Instance,
  InstanceParams,
  ModelsWithPagination,
  Region,
  RegionParams,
} from "@/common/types/deployments";

const getInstancesParams = (params: InstanceParams) => {
  const instancesParams = new URLSearchParams();
  params.region && instancesParams.append("region", params.region);
  return instancesParams.toString();
};

const getRegionsParams = (params: RegionParams) => {
  const regionParams = new URLSearchParams();
  params.provider && regionParams.append("provider", params.provider);
  return regionParams.toString();
};

export const deploymentsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getInstances: builder.query<Instance[], InstanceParams>({
        query: (params: InstanceParams) => ({
          url: `/api/aithos/instances/?${getInstancesParams(params)}`,
          method: "get",
        }),
        keepUnusedDataFor: 60 * 60,
      }),
      getRegionsByQueryParams: builder.query<Region[], RegionParams>({
        query: (params: RegionParams) => ({
          url: `/api/aithos/regions/?${getRegionsParams(params)}`,
          method: "get",
        }),
        keepUnusedDataFor: 60 * 60,
      }),
      getRegionsById: builder.query<Region[], number>({
        query: (id: number) => ({
          url: `/api/aithos/regions/${id}`,
          method: "get",
        }),
        keepUnusedDataFor: 60 * 60,
      }),
      getModels: builder.query<ModelsWithPagination, { offset: number; query?: string }>({
        query: ({ offset, query }) => {
          const queryParams = new URLSearchParams({
            limit: "20",
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
  useGetRegionsByIdQuery,
  useGetRegionsByQueryParamsQuery,
  useGetDeploymentsQuery,
  useGetModelsQuery,
  useDeleteDeploymentMutation,
} = deploymentsApi;
