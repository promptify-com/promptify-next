import { useDeferredValue, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { RootState } from "@/core/store";
import { useGetCategoriesQuery, useGetCategoryBySlugQuery } from "@/core/api/categories";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { FilterParams, SelectedFilters } from "@/core/api/dto/templates";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";
import useDebounce from "./useDebounce";

export function useGetTemplatesByFilter() {
  const router = useRouter();
  const splittedPath = router.pathname.split("/");

  const hasPathname = (route: "explore" | "[categorySlug]" | "[subcategorySlug]") => {
    return splittedPath.includes(route);
  };

  const { categorySlug, subcategorySlug } = router.query;

  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery(undefined, {
    skip: !hasPathname("explore"),
  });
  const { data: category } = useGetCategoryBySlugQuery(categorySlug as string, {
    skip: !hasPathname("[categorySlug]"),
  });
  const { data: subcategory } = useGetCategoryBySlugQuery(subcategorySlug as string, {
    skip: !hasPathname("[subcategorySlug]"),
  });

  const tagsQuery = useGetTagsPopularQuery(undefined, { skip: !hasPathname("explore") });
  const enginesQuery = useGetEnginesQuery(undefined, { skip: !hasPathname("explore") });

  const filters = useSelector((state: RootState) => state.filters);
  const tags = useSelector((state: RootState) => state.filters.tag);
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);
  const title = useSelector((state: RootState) => state.filters.title);

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
    engineId,
    categoryId: category?.id,
    subcategoryId: subcategory?.id,
    title: title ?? debouncedSearchName,
    offset,
    limit: PAGINATION_LIMIT,
  };
  const { data: templates, isLoading: isTemplatesLoading, isFetching } = useGetTemplatesByFilterQuery(params);

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
  };

  const handleNextPage = () => {
    if (templates?.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };

  const handlePreviousPage = () => {
    if (templates?.previous) {
      setOffset(prevOffset => Math.max(0, prevOffset - PAGINATION_LIMIT));
    }
  };

  const hasNext = !!templates?.next;
  const hasPrev = !!templates?.previous;

  return {
    categorySlug,
    searchName,
    setSearchName,
    debouncedSearchName,
    subcategorySlug,
    subcategory,
    allFilterParamsNull,
    categories,
    isCategoryLoading,
    templates,
    isTemplatesLoading,
    filters,
    handleNextPage,
    handlePreviousPage,
    hasPrev,
    hasNext,
    resetOffest,
    isFetching,
    tags: tagsQuery.data,
    engines: enginesQuery.data,
  };
}
