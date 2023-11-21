import { useDeferredValue, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { RootState } from "@/core/store";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { FilterParams, SelectedFilters } from "@/core/api/dto/templates";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";
import useDebounce from "./useDebounce";

import { Templates } from "@/core/api/dto/templates";

interface Props {
  catId?: number;
  subCatId?: number;
  ordering?: string;
  admin?: boolean;
  templateLimit?: number;
  paginatedList?: boolean;
}

export function useGetTemplatesByFilter({
  catId,
  subCatId,
  ordering,
  admin = false,
  templateLimit,
  paginatedList = false,
}: Props = {}) {
  const router = useRouter();
  const splittedPath = router.pathname.split("/");
  const hasPathname = (route: "explore" | "[categorySlug]" | "[subcategorySlug]") => {
    return splittedPath.includes(route);
  };
  const { categorySlug, subcategorySlug } = router.query;
  const tagsQuery = useGetTagsPopularQuery(undefined, { skip: !hasPathname("explore") });
  const enginesQuery = useGetEnginesQuery(undefined, { skip: !hasPathname("explore") });
  const filters = useSelector((state: RootState) => state.filters);
  const { tag: tags, engine, title } = filters;
  const [offset, setOffset] = useState(0);
  const [searchName, setSearchName] = useState("");
  const deferredSearchName = useDeferredValue(searchName);
  const debouncedSearchName = useDebounce<string>(deferredSearchName, 300);
  const [status, setStatus] = useState<string>();
  const PAGINATION_LIMIT = templateLimit ?? 10;
  const memoizedFilteredTags = useMemo(() => {
    const filteredTags = tags
      .filter(item => item !== null)
      .map(item => item?.name)
      .join("&tag=");

    return filteredTags;
  }, [tags]);
  const params: FilterParams = {
    tag: memoizedFilteredTags,
    engineId: engine?.id,
    categoryId: catId,
    subcategoryId: subCatId,
    title: title ?? debouncedSearchName,
    offset,
    limit: PAGINATION_LIMIT,
    status,
    ordering,
  };
  const skipFetchingTemplates = ![catId, subCatId, admin, ordering].some(_param => _param);
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
      filters.subCategory === null
    );
  }
  const allFilterParamsNull = areAllStatesNull(filters);

  const resetOffest = (status?: string) => {
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

  const filteredTemplates = admin
    ? allTemplates
    : allTemplates?.filter(template => (typeof template?.is_internal === "undefined" ? true : !template.is_internal));

  return {
    categorySlug,
    searchName,
    setSearchName,
    debouncedSearchName,
    subcategorySlug,
    allFilterParamsNull,
    templates: filteredTemplates,
    isTemplatesLoading,
    filters,
    handleNextPage,
    resetOffest,
    isFetching,
    tags: tagsQuery.data,
    engines: enginesQuery.data,
    hasMore,
    status,
    hasPrev,
    handlePrevPage,
  };
}
