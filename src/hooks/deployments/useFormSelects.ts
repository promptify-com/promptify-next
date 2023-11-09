import { ModelFields } from "@/common/types/deployments";
import { useGetInstancesQuery, useGetModelsQuery, useGetRegionsByQueryParamsQuery } from "@/core/api/deployments";
import { useEffect, useState } from "react";

export const useFormSelects = (provider: string, region: string) => {
  const PAGINATION_LIMIT = 20;
  const [offset, setOffset] = useState(0);
  const [localModels, setLocalModels] = useState<ModelFields[]>([]); // Local state to store all models

  const isProviderSelected = provider !== "";
  const isRegionSelected = region !== "";

  const { data: models, isFetching: isModelsFetching } = useGetModelsQuery(offset, {
    skip: isProviderSelected && isRegionSelected,
  });

  const { data: instances, isFetching: isInstanceFetching } = useGetInstancesQuery(
    { region: region.toString() },
    { skip: !isRegionSelected },
  );
  const { data: regions, isFetching: isRegionFetching } = useGetRegionsByQueryParamsQuery(
    { provider: provider.toString() },
    { skip: !isProviderSelected },
  );

  useEffect(() => {
    if (models && models?.results.length > 0) {
      setLocalModels(prevModels => [...prevModels, ...models.results]);
    }
  }, [models]);

  const fetchMoreModels = () => {
    if (models && models.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };

  const hasMoreModels = !!models?.next;
  return {
    instances,
    regions,
    isProviderSelected,
    isRegionSelected,
    isInstanceFetching,
    isRegionFetching,
    models: localModels,
    isModelsFetching,
    hasMoreModels,
    fetchMoreModels,
  };
};
