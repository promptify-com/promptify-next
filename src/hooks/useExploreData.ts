// customHooks/useExploreData.ts
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { useGetCategoriesQuery } from "@/core/api/categories";
import { useGetTemplatesByFilterQuery } from "@/core/api/explorer";
import { FilterParams, Tag } from "@/core/api/dto/templates";

export function useExploreData() {
  const filters = useSelector((state: RootState) => state.filters);
  const tags = useSelector((state: RootState) => state.filters.tag);
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);
  const title = useSelector((state: RootState) => state.filters.title);
  const filteredTags = tags
    .filter((item: Tag | null) => item !== null)
    .map((item: Tag | null) => item?.name)
    .join("&tag=");
  const params: FilterParams = {
    tag: filteredTags,
    engineId,
    title,
  };

  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByFilterQuery(params);

  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

  return {
    categories,
    isCategoryLoading,
    templates,
    isTemplatesLoading,
    filters,
  };
}
