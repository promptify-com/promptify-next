import { baseApi } from "./api";
import {
  CreateDeployment,
  Deployment,
  Instance,
  InstanceParams,
  Region,
  RegionParams,
} from "@/common/types/deployments";

const getInstancesParams = (params: InstanceParams) => {
  const instancesParams = new URLSearchParams();
  params.cost && instancesParams.append("cost", params.cost);
  params.region && instancesParams.append("region", params.region);
  params.instance_type && instancesParams.append("instance_type", params.instance_type);
  params.vcpus && instancesParams.append("vcpus", params.vcpus);
  params.memory && instancesParams.append("memory", params.memory);
  params.num_gpus && instancesParams.append("memory", params.num_gpus);

  return instancesParams.toString();
};

const getRegionsParams = (params: RegionParams) => {
  const regionParams = new URLSearchParams();
  params.endpoint && regionParams.append("endpoint", params.endpoint);
  params.name && regionParams.append("name", params.name);
  params.protocol && regionParams.append("protocol", params.protocol);
  params.provider && regionParams.append("provider", params.provider);
  params.short_name && regionParams.append("short_name", params.short_name);

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

      getDeployments: builder.query<Deployment[], void>({
        query: () => ({
          url: `/api/aithos/deployments`,
          method: "get",
        }),
        providesTags: ["Deployments"],
      }),
      createDeployment: builder.mutation({
        query: (data: CreateDeployment) => ({
          url: `/api/aithos/deployments/`,
          method: "post",
          data,
        }),
        invalidatesTags: ["Deployments"],
      }),
    };
  },
});

export const {
  useGetInstancesQuery,
  useGetRegionsByIdQuery,
  useGetRegionsByQueryParamsQuery,
  useGetDeploymentsQuery,
  useCreateDeploymentMutation,
} = deploymentsApi;
