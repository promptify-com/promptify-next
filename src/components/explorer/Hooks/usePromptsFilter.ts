import { useEffect, useMemo, useState } from "react";
import type { Engine, EngineType, Tag } from "@/core/api/dto/templates";
import { useRouter } from "next/router";
import { contentTypeItems } from "@/components/sidebar/Constants";
import { ParsedUrlQueryInput } from "querystring";
import { useGetEnginesQuery } from "@/core/api/engines";
import { IFilterSliceState } from "@/core/store/types";
import SessionStorage from "@/common/Storage/SessionStorage";

type SessionFilter = { [key: string]: ParsedUrlQueryInput };

const usePromptsFilter = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<IFilterSliceState>({
    title: null,
    isFavorite: false,
    engine: null,
    engineType: [],
    tag: [],
  });

  const routerKey = router.query.key as string | undefined;
  const routerEngine = router.query.engine as string | undefined;
  const routerEngineTypes = router.query.type as string | undefined;
  const routerTags = router.query.tags as string | undefined;
  const routerIsFavorite = router.query.isFavorite as string | undefined;

  const { data: engines, isLoading: enginesLoading } = useGetEnginesQuery(undefined, { skip: !routerEngine });

  const filtersCount = useMemo(() => {
    let count = 0;

    if (filters.engine) count += 1;
    if (filters.category) count += 1;
    if (filters.subCategory) count += 1;
    if (filters.title) count += 1;
    if (filters.isFavorite) count += 1;

    count += filters.tag.length;
    count += filters.engineType.length;

    return count;
  }, [filters]);

  const handleSelectKeyword = (key: string | null) => {
    updateQueryParams({
      key,
    });
  };

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
        tags: filters.tag
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
    const keepTypes = filters.engineType.filter(type => !selectedTypes.some(sType => sType.id === type.id));
    const updatedTypes = keepTypes.concat(selectedTypes);
    setFilters({ ...filters, engineType: updatedTypes });
    updateQueryParams({ type: updatedTypes.map(type => type.id).join(",") });
  };

  const deleteSelectedEngineType = (engineType: EngineType) => {
    const updatedTypes = filters.engineType.filter(type => type.id !== engineType.id);
    updateQueryParams({ type: updatedTypes.map(type => type.id).join(",") });
  };

  const resetFilters = () => {
    const pathname = router.asPath.split("?")[0];
    router.push(
      {
        pathname,
      },
      undefined,
      {
        shallow: true,
      },
    );
    resetSessionStorage();
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

  const updateSessionStorage = () => {
    const sessionFilters = SessionStorage.get("filters") as unknown as SessionFilter;
    const params = Object.keys(router.query).filter(param => param !== "categorySlug");
    if (!!params.length) {
      SessionStorage.set("filters", JSON.stringify({ ...sessionFilters, [router.pathname]: router.query }));
    } else {
      if (sessionFilters && !Object.keys(sessionFilters).length) {
        SessionStorage.remove("filters");
      }
    }
  };

  const resetSessionStorage = () => {
    const sessionFilters = SessionStorage.get("filters") as unknown as SessionFilter;
    if (sessionFilters) {
      delete sessionFilters[router.pathname];
      SessionStorage.set("filters", JSON.stringify(sessionFilters));
    }
  };

  useEffect(() => {
    if (enginesLoading) return;

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
      title: routerKey ?? null,
      isFavorite,
      engine: selectedEngine ?? null,
      engineType: engineTypes,
      tag: tags,
    });

    updateSessionStorage();
  }, [router.query, engines]);

  useEffect(() => {
    const sessionFilters = SessionStorage.get("filters") as unknown as SessionFilter;
    const sessionQueryParams = sessionFilters?.[router.pathname];
    if (sessionQueryParams) {
      // As categorySlug is treated as a query param it needs to be replaced and have current router value
      if (sessionQueryParams.categorySlug && router.query.categorySlug) {
        sessionQueryParams.categorySlug = router.query.categorySlug;
      }
      updateQueryParams(sessionQueryParams);
    }
  }, []);

  return {
    filters,
    handleSelectKeyword,
    handleCheckIsFavorite,
    handleSelectEngine,
    handleSelectEngineType,
    handleSelectTag,
    resetFilters,
    filtersCount,
  };
};

export default usePromptsFilter;
