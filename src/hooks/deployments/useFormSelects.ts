import { useEffect, useState } from "react";

import type { ModelFields } from "@/common/types/deployments";
import { useGetInstancesQuery, useGetModelsQuery, useGetRegionsByQueryParamsQuery } from "@/core/api/deployments";

export const useFormSelects = (provider: string, region: string, query?: string) => {
  const PAGINATION_LIMIT = 20;
  const [offset, setOffset] = useState(0);
  const [localModels, setLocalModels] = useState<ModelFields[]>([]);

  const isProviderSelected = provider !== "";
  const isRegionSelected = region !== "";

  const { data: models, isFetching: isModelsFetching } = useGetModelsQuery({ limit: PAGINATION_LIMIT, offset, query });

  const { data: instances, isFetching: isInstanceFetching } = useGetInstancesQuery(
    { region: region.toString() },
    { skip: !isRegionSelected },
  );
  const { data: regions, isFetching: isRegionFetching } = useGetRegionsByQueryParamsQuery(
    { provider: provider.toString() },
    { skip: !isProviderSelected },
  );

  useEffect(() => {
    setLocalModels([]);
    setOffset(0);
  }, [query]);

  useEffect(() => {
    if (models && models.results.length > 0) {
      setLocalModels(prevModels => [...prevModels, ...models.results]);
    }
  }, [models]);

  const hasMoreModels = !!models?.next;

  const fetchMoreModels = () => {
    if (hasMoreModels) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };

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
