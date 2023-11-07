import { useGetInstancesQuery, useGetRegionsByQueryParamsQuery } from "@/core/api/deployments";

export const useFormSelects = (provider: string, region: string) => {
  const isProviderSelected = provider !== "";
  const isRegionSelected = region !== "";

  const { data: instances, isFetching: isInstanceFetching } = useGetInstancesQuery(
    { region: region.toString() },
    { skip: !isRegionSelected },
  );
  const { data: regions, isFetching: isRegionFetching } = useGetRegionsByQueryParamsQuery(
    { provider: provider.toString() },
    { skip: !isProviderSelected },
  );

  return { instances, regions, isProviderSelected, isRegionSelected, isInstanceFetching, isRegionFetching };
};
