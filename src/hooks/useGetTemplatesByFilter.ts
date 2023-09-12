import { useDeferredValue, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { RootState } from "@/core/store";
import { useGetCategoriesQuery } from "@/core/api/categories";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { FilterParams, SelectedFilters } from "@/core/api/dto/templates";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";
import useDebounce from "./useDebounce";

import { Templates } from "@/core/api/dto/templates";

export function useGetTemplatesByFilter(catId?: number, subCatId?: number) {
  const router = useRouter();
  const splittedPath = router.pathname.split("/");

  const hasPathname = (route: "explore" | "[categorySlug]" | "[subcategorySlug]") => {
    return splittedPath.includes(route);
  };

  const { categorySlug, subcategorySlug } = router.query;

  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery(undefined, {
    skip: !hasPathname("explore"),
  });

  const tagsQuery = useGetTagsPopularQuery(undefined, { skip: !hasPathname("explore") });
  const enginesQuery = useGetEnginesQuery(undefined, { skip: !hasPathname("explore") });

  const filters = useSelector((state: RootState) => state.filters);
  const { tag: tags, engine, title } = filters;

  const PAGINATION_LIMIT = 10;
  const [offset, setOffset] = useState(0);

  const [searchName, setSearchName] = useState("");
  const deferredSearchName = useDeferredValue(searchName);
  const debouncedSearchName = useDebounce<string>(deferredSearchName, 300);

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
    title: title ?? searchName,
    offset,
    limit: PAGINATION_LIMIT,
  };
  const { data: templates, isLoading: isTemplatesLoading, isFetching } = useGetTemplatesByFilterQuery(params);

  const [allTemplates, setAllTemplates] = useState<Templates[]>([]);
  const [resetFlag, setResetFlag] = useState(true);

  useEffect(() => {
    if (templates?.results) {
      if (resetFlag) {
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

  const resetOffest = () => {
    setOffset(0);
    setResetFlag(true);
  };

  const handleNextPage = () => {
    if (!!templates?.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
      setResetFlag(false);
    }
  };

  const hasMore = !!templates?.next;

  return {
    categorySlug,
    searchName,
    setSearchName,
    debouncedSearchName,
    subcategorySlug,
    allFilterParamsNull,
    categories,
    isCategoryLoading,
    templates: allTemplates,
    isTemplatesLoading,
    filters,
    handleNextPage,
    resetOffest,
    isFetching,
    tags: tagsQuery.data,
    engines: enginesQuery.data,
    hasMore,
  };
}
