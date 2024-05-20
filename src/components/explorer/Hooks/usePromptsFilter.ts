import { useEffect, useState } from "react";
import type { Engine, EngineType, SelectedFilters, Tag } from "@/core/api/dto/templates";
import { useRouter } from "next/router";
import { contentTypeItems } from "@/components/sidebar/Constants";
import { ParsedUrlQueryInput } from "querystring";
import { useGetEnginesQuery } from "@/core/api/engines";

const usePromptsFilter = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<SelectedFilters>({
    engine: null,
    tag: [],
    title: null,
    category: null,
    subCategory: null,
    engineType: [],
    isFavorite: false,
  });
  const { data: engines } = useGetEnginesQuery();

  const routerEngine = router.query.engine as string | undefined;
  const routerEngineTypes = router.query.type as string | undefined;
  const routerTags = router.query.tags as string | undefined;
  const routerIsFavorite = router.query.isFavorite as string | undefined;

  const handleCheckIsFavorite = (isFavorite: boolean) => {
    updateQueryParams({
      isFavorite,
    });
  };

  const handleSelectEngine = (engine: Engine | null) => {
    updateQueryParams({
      engine: engine?.id,
    });
  };

  const handleSelectEngineType = (engineType: EngineType) => {
    const isSelected = filters.engineType.some(type => type.id === engineType.id);
    if (isSelected) {
      deleteSelectedEngineType(engineType);
    } else {
      selectEngineType(engineType);
    }
  };

  const handleSelectTag = (selectedTag: Tag) => {
    const tagExists = filters.tag.some(tag => tag.id === selectedTag.id);
    if (tagExists) {
      updateQueryParams({
        tags: [...filters.tag]
          .filter(tag => tag.id !== selectedTag.id)
          .map(tag => `${tag.id}_${tag.name}`)
          .join(","),
      });
    } else {
      updateQueryParams({
        tags: filters.tag
          .map(tag => `${tag.id}_${tag.name}`)
          .concat(`${selectedTag.id}_${selectedTag.name}`)
          .join(","),
      });
    }
  };

  const selectEngineType = (engineType: EngineType) => {
    const selectedTypes = Array.isArray(engineType) ? engineType : [engineType];
    const keepTypes = [...filters.engineType].filter(type => !selectedTypes.some(sType => sType.id === type.id));
    const updatedTypes = keepTypes.concat(selectedTypes);
    setFilters({ ...filters, engineType: updatedTypes });
    updateQueryParams({ type: updatedTypes.map(type => type.id).join(",") });
  };

  const deleteSelectedEngineType = (engineType: EngineType) => {
    const updatedTypes = [...filters.engineType].filter(type => type.id !== engineType.id);
    updateQueryParams({ type: updatedTypes.map(type => type.id).join(",") });
  };

  const updateQueryParams = (newParams: ParsedUrlQueryInput) => {
    const updatedQuery = { ...router.query, ...newParams };

    Object.keys(updatedQuery).forEach(key => {
      if (!updatedQuery[key]) {
        delete updatedQuery[key];
      }
    });

    router.push(
      {
        pathname: router.pathname,
        query: updatedQuery,
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  useEffect(() => {
    const isFavorite = Boolean(routerIsFavorite);
    const selectedEngine = routerEngine ? engines?.find(eng => eng.id === Number(routerEngine)) : null;
    const engineTypes = routerEngineTypes
      ? routerEngineTypes
          .split(",")
          .map(rType => {
            const contentType = contentTypeItems.find(type => type.id === Number(rType));
            if (contentType) {
              return { id: contentType.id, label: contentType.name };
            }
            return undefined;
          })
          .filter((type): type is { id: number; label: string } => type !== undefined)
      : [];
    const tags = routerTags
      ? routerTags.split(",").map(tag => {
          const [id, name] = tag.split("_");
          return { id: Number(id), name };
        })
      : [];

    setFilters({
      ...filters,
      isFavorite,
      engine: selectedEngine ?? null,
      engineType: engineTypes,
      tag: tags,
    });
  }, [router.query]);

  return {
    filters,
    handleCheckIsFavorite,
    handleSelectEngine,
    handleSelectEngineType,
    handleSelectTag,
  };
};

export default usePromptsFilter;
