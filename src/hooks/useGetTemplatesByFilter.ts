import { useDeferredValue, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import useDebounce from "@/hooks/useDebounce";
import { useAppSelector } from "@/hooks/useStore";
import type { Templates, FilterParams, LowercaseTemplateStatus, SelectedFilters } from "@/core/api/dto/templates";
import usePromptsFilter from "@/components/explorer/Hooks/usePromptsFilter";

interface Props {
  catId?: number;
  subCatId?: number;
  ordering?: string;
  admin?: boolean;
  templateLimit?: number;
  paginatedList?: boolean;
  initialStatus?: LowercaseTemplateStatus;
  shouldSkip?: boolean;
  includeExtraFields?: string;
}

export function useGetTemplatesByFilter({
  catId,
  subCatId,
  ordering,
  admin = false,
  templateLimit,
  paginatedList = false,
  initialStatus,
  shouldSkip = true,
  includeExtraFields,
}: Props = {}) {
  const router = useRouter();
  const { categorySlug, subcategorySlug } = router.query;
  const [offset, setOffset] = useState(0);
  const [searchName, setSearchName] = useState("");
  const deferredSearchName = useDeferredValue(searchName);
  const debouncedSearchName = useDebounce<string>(deferredSearchName, 300);
  const [status, setStatus] = useState<LowercaseTemplateStatus | undefined>(initialStatus);
  const PAGINATION_LIMIT = templateLimit ?? 10;

  const { filters } = usePromptsFilter();
  const { title, isFavorite, engine, engineType, tag: tags } = filters;

  const params: FilterParams = {
    tags,
    engineId: engine?.id,
    engine_type: engineType,
    categoryId: catId,
    subcategoryId: subCatId,
    title: title ?? debouncedSearchName,
    offset,
    limit: PAGINATION_LIMIT,
    status,
    ordering,
    isFavorite,
    isInternal: false,
    include: `id,slug,thumbnail,title,description,favorites_count,likes,created_by,tags,status,executions_count${
      includeExtraFields?.length ? includeExtraFields : ""
    }`,
  };

  if (admin) {
    delete params.isInternal;
  }

  const allFilterParamsNull = areAllStatesNull(filters);
  const skipFetchingTemplates = shouldSkip
    ? ![catId, subCatId, admin, ordering].some(_param => _param) ||
      !Object.values(filters)?.length ||
      (ordering === "-likes" && allFilterParamsNull)
    : false;

  const {
    data: templates,
    isLoading: isTemplatesLoading,
    isFetching,
  } = useGetTemplatesByFilterQuery(params, { skip: skipFetchingTemplates });
  const [allTemplates, setAllTemplates] = useState<Templates[]>([]);

  useEffect(() => {
    if (templates?.results) {
      if (offset === 0 || paginatedList) {
        setAllTemplates(templates?.results);
      } else {
        setAllTemplates(prevTemplates => prevTemplates.concat(templates?.results));
      }
    }
  }, [templates?.results]);

  function areAllStatesNull(filters: SelectedFilters): boolean {
    return (
      filters.engine === null &&
      filters.tag.every(tag => tag === null) &&
      filters.title === null &&
      filters.category === null &&
      filters.subCategory === null &&
      !filters.engineType.length
    );
  }

  const resetOffest = (status?: LowercaseTemplateStatus) => {
    setOffset(0);
    if (status) setStatus(status as LowercaseTemplateStatus);
  };

  const handleNextPage = () => {
    if (!!templates?.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };
  const handlePrevPage = () => {
    if (!!templates?.previous) {
      setOffset(prevOffset => prevOffset - PAGINATION_LIMIT);
    }
  };

  const hasMore = !!templates?.next;
  const hasPrev = !!templates?.previous;

  return {
    categorySlug,
    searchName,
    setSearchName,
    debouncedSearchName,
    subcategorySlug,
    allFilterParamsNull,
    templates: allTemplates,
    isTemplatesLoading,
    handleNextPage,
    resetOffest,
    isFetching,
    hasMore,
    status,
    hasPrev,
    handlePrevPage,
  };
}
