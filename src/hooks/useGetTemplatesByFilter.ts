import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { RootState } from "@/core/store";
import { useGetCategoriesQuery, useGetCategoryBySlugQuery } from "@/core/api/categories";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { FilterParams, SelectedFilters, Tag } from "@/core/api/dto/templates";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";
import useDebounce from "./useDebounce";

export function useGetTemplatesByFilter() {
  const router = useRouter();
  const pathname = router.pathname;

  const splittedPath = pathname.split("/");
  const isExplorePage = splittedPath[1] == "explore";

  const { categorySlug, subcategorySlug } = router.query;

  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery(undefined, { skip: !isExplorePage });
  const { data: category } = useGetCategoryBySlugQuery(categorySlug as string, { skip: !isExplorePage });
  const { data: subcategory } = useGetCategoryBySlugQuery(subcategorySlug as string, { skip: !isExplorePage });

  const tagsQuery = useGetTagsPopularQuery(undefined, { skip: !isExplorePage });
  const enginesQuery = useGetEnginesQuery(undefined, { skip: !isExplorePage });

  const filters = useSelector((state: RootState) => state.filters);
  const tags = useSelector((state: RootState) => state.filters.tag);
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);
  const title = useSelector((state: RootState) => state.filters.title);

  const PAGINATION_LIMIT = 10;
  const [offset, setOffset] = useState(0);
  const [searchName, setSearchName] = useState("");

  const debouncedSearchValue = useDebounce<string>(searchName, 300);

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
    title: title ?? debouncedSearchValue,
    offset,
    limit: PAGINATION_LIMIT,
  };
  const { data: templates, isLoading: isTemplatesLoading, isFetching } = useGetTemplatesByFilterQuery(params);

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

  const hasNext = !!templates?.next;
  const hasPrev = !!templates?.previous;

  return {
    categorySlug,
    searchName,
    setSearchName,
    debouncedSearchValue,
    setOffset,
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
    isFetching,
    tags: tagsQuery.data,
    engines: enginesQuery.data,
  };
}
