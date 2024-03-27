import { useDeferredValue, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { FilterParams, LowercaseTemplateStatus, SelectedFilters, TemplateStatus } from "@/core/api/dto/templates";
import useDebounce from "./useDebounce";
import { Templates } from "@/core/api/dto/templates";

interface Props {
  catId?: number;
  subCatId?: number;
  ordering?: string;
  admin?: boolean;
  templateLimit?: number;
  paginatedList?: boolean;
  initialStatus?: LowercaseTemplateStatus;
}

export function useGetTemplatesByFilter({
  catId,
  subCatId,
  ordering,
  admin = false,
  templateLimit,
  paginatedList = false,
  initialStatus,
}: Props = {}) {
  const router = useRouter();
  const { categorySlug, subcategorySlug } = router.query;
  const filters = useSelector((state: RootState) => state.filters);
  const { tag: tags, engine, title, engineType, isFavourite } = filters;
  const [offset, setOffset] = useState(0);
  const [searchName, setSearchName] = useState("");
  const deferredSearchName = useDeferredValue(searchName);
  const debouncedSearchName = useDebounce<string>(deferredSearchName, 300);
  const [status, setStatus] = useState<LowercaseTemplateStatus | undefined>(initialStatus);
  const PAGINATION_LIMIT = templateLimit ?? 10;

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
    isFavourite: isFavourite,
    isInternal: false,
  };

  if (admin) {
    delete params.isInternal;
  }

  const allFilterParamsNull = areAllStatesNull(filters);
  const skipFetchingTemplates =
    ![catId, subCatId, admin, ordering].some(_param => _param) ||
    !Object.values(filters)?.length ||
    (ordering === "-likes" && allFilterParamsNull);
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
      !filters.engineType.length &&
      filters.isFavourite === false
    );
  }

  const resetOffest = (status?: LowercaseTemplateStatus) => {
    setOffset(0);
    if (status) setStatus(status);
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
    filters,
    handleNextPage,
    resetOffest,
    isFetching,
    hasMore,
    status,
    hasPrev,
    handlePrevPage,
  };
}
