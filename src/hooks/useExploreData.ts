// customHooks/useExploreData.ts
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { useGetCategoriesQuery } from "@/core/api/categories";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { FilterParams, Tag } from "@/core/api/dto/templates";
import { useState } from "react";

export function useExploreData() {
  const filters = useSelector((state: RootState) => state.filters);
  const tags = useSelector((state: RootState) => state.filters.tag);
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);
  const title = useSelector((state: RootState) => state.filters.title);

  const [offset, setOffset] = useState(0);

  const filteredTags = tags
    .filter((item: Tag | null) => item !== null)
    .map((item: Tag | null) => item?.name)
    .join("&tag=");
  const params: FilterParams = {
    tag: filteredTags,
    engineId,
    title,
    offset,
    limit: 10,
  };

  const { data: templates, isLoading: isTemplatesLoading } = useGetTemplatesByFilterQuery(params);

  const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery();

  const handleNextPage = () => {
    setOffset(prevOffset => prevOffset + 10); // Assuming you're using a limit of 10
  };

  const handlePreviousPage = () => {
    setOffset(prevOffset => Math.max(0, prevOffset - 10)); // Assuming you're using a limit of 10
  };

  return {
    categories,
    isCategoryLoading,
    templates,
    isTemplatesLoading,
    filters,
    handleNextPage,
    handlePreviousPage,
  };
}
