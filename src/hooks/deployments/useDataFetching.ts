import { useEffect, useState } from "react";
import type { Model, Instance, FetchingDataType } from "@/common/types/deployments";
import { useGetPaginatedDataQuery } from "@/core/api/deployments";

export default function useDataFetching(region: string, type: FetchingDataType, query?: string) {
  const isModelType = type === "models";
  const PAGINATION_LIMIT = 20;
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<Model[] | Instance[]>([]);
  const isRegionEmpty = region === "";
  const params = { limit: PAGINATION_LIMIT, offset, query, type, ...(!isModelType && { region }) };
  const { data: fetchedData, isFetching } = useGetPaginatedDataQuery(params, {
    ...(!isModelType && { skip: isRegionEmpty }),
  });

  const hasNextData = !!fetchedData?.next;
  const hasPrevData = !!fetchedData?.previous;
  const fetchNextData = () => {
    if (hasNextData) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };
  const fetchPrevData = () => {
    if (!!fetchedData?.previous) {
      setOffset(prevOffset => prevOffset - PAGINATION_LIMIT);
    }
  };
  const resetStateDeps = isModelType ? [query] : [query, region];

  useEffect(() => {
    setData([]);
    setOffset(0);
  }, resetStateDeps);

  useEffect(() => {
    if (!!fetchedData?.results?.length) {
      // @ts-ignore
      setData(prevData => prevData.concat(fetchedData.results));
    }
  }, [fetchedData]);

  return {
    isRegionEmpty,
    data,
    isFetching,
    hasNextData,
    hasPrevData,
    fetchNextData,
    fetchPrevData,
  };
}
