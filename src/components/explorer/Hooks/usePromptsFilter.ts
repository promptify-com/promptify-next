import { useEffect, useState } from "react";
import type { EngineType, SelectedFilters } from "@/core/api/dto/templates";
import { useAppDispatch } from "@/hooks/useStore";
import { useRouter } from "next/router";
import { contentTypeItems } from "@/components/sidebar/Constants";
import { ParsedUrlQueryInput } from "querystring";

const usePromptsFilter = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<SelectedFilters>({
    engine: null,
    tag: [],
    title: null,
    category: null,
    subCategory: null,
    engineType: [],
    isFavourite: false,
  });

  const routerEngineTypes = router.query.type as string | undefined;

  const handleSelectEngineType = (engineType: EngineType) => {
    const isSelected = filters.engineType.some(type => type.id === engineType.id);
    if (isSelected) {
      deleteSelectedEngineType(engineType);
    } else {
      selectEngineType(engineType);
    }
  };

  const selectEngineType = (engineType: EngineType) => {
    const selectedTypes = Array.isArray(engineType) ? engineType : [engineType];
    const keepTypes = filters.engineType.filter(type => !selectedTypes.some(sType => sType.id === type.id));
    const updatedTypes = keepTypes.concat(selectedTypes);
    setFilters({ ...filters, engineType: updatedTypes });
    updateQueryParams({ type: updatedTypes.map(type => type.id).join(",") });
  };

  const deleteSelectedEngineType = (engineType: EngineType) => {
    const updatedTypes = filters.engineType.filter(type => type.id !== engineType.id);
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
    setFilters({ ...filters, engineType: engineTypes });
  }, [routerEngineTypes]);

  useEffect(() => {
    // const engineTypes = routerEngineTypes
    //   .split(",")
    //   .map(rType => {
    //     const contentType = contentTypeItems.find(type => type.id === Number(rType));
    //     if (contentType) {
    //       return { id: contentType.id, label: contentType.name };
    //     }
    //   })
    //   .filter((type): type is { id: number; label: string } => type !== undefined);
    // selectEngineType(engineTypes);
    // const storedTags = (Storage.get("tagFilter") as unknown as Tag[]) || [];
    // const storedEngineType = (Storage.get("engineTypeFilter") as unknown as EngineType[]) || [];
    // if (storedEngine) {
    //   dispatch(setSelectedEngine(storedEngine));
    // }
    // if (storedTags.length > 0) {
    //   storedTags.forEach((tag: Tag) => {
    //     dispatch(setSelectedTag(tag));
    //   });
    // }
    // if (storedEngineType) {
    //   dispatch(setSelectedEngineType(storedEngineType));
    // }
  }, []);

  return {
    filters,
    handleSelectEngineType,
  };
};

export default usePromptsFilter;
