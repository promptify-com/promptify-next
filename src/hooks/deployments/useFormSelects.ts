import { useGetInstancesQuery, useGetRegionsByQueryParamsQuery } from "@/core/api/deployments";

export const useFormSelects = (provider: string, region: string) => {
  const isProviderSelected = provider !== "";
  const isRegionSelected = region !== "";

  const { data: instances } = useGetInstancesQuery({ region: region.toString() }, { skip: !isRegionSelected });
  const { data: regions } = useGetRegionsByQueryParamsQuery(
    { provider: provider.toString() },
    { skip: !isProviderSelected },
  );

  return { instances, regions, isProviderSelected, isRegionSelected };
};
