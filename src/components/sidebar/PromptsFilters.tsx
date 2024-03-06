import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapsible from "./Collapsible";
import Storage from "@/common/storage";

import type { Item } from "./Collapsible";
import { useEffect } from "react";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";
import {
  setSelectedEngine,
  setSelectedTag,
  deleteSelectedTag,
  setSelectedEngineType,
  setMyFavoritesChecked,
} from "@/core/store/filtersSlice";
import type { Engine, Tag } from "@/core/api/dto/templates";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";

const contentTypeItems: Item[] = [
  { name: "Text", id: 1, type: "engineType" },
  { name: "Image", id: 2, type: "engineType" },
  { name: "Video", id: 3, type: "engineType" },
  { name: "Audio", id: 4, type: "engineType" },
];

function MyFavorites() {
  const dispatch = useAppDispatch();

  const { isFavourite } = useAppSelector(state => state.filters);

  useEffect(() => {
    const storedFavourite = Storage.get("myFavoritesChecked") || false;
    dispatch(setMyFavoritesChecked(storedFavourite));
  }, []);

  return (
    <Stack
      sx={{
        bgcolor: "#EEEEE8",
        borderRadius: "16px",
        mb: "20px",
        mt: "20px",
        p: "8px 8px 8px 16px",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Typography width={"50%"}>My favorites:</Typography>
      <FormControlLabel
        control={<Switch color="primary" />}
        label={""}
        checked={isFavourite}
        name="my_favorites"
        value={""}
        onChange={(_, _checked) => dispatch(setMyFavoritesChecked(_checked))}
        sx={{
          width: "50%",
          justifyContent: "flex-end",
        }}
      />
    </Stack>
  );
}

function PromptsFilters() {
  const dispatch = useAppDispatch();
  const { data: tags } = useGetTagsPopularQuery();
  const { data: engines } = useGetEnginesQuery();
  const { tag, engine, engineType } = useAppSelector(state => state.filters);

  useEffect(() => {
    const storedEngine = Storage.get("engineFilter") || null;
    const storedTags = Storage.get("tagFilter") || [];
    const storedEngineType = Storage.get("engineTypeFilter") || "";

    if (storedEngine) {
      dispatch(setSelectedEngine(storedEngine));
    }

    if (storedTags.length > 0) {
      storedTags.forEach((tag: Tag) => {
        dispatch(setSelectedTag(tag));
      });
    }

    if (storedEngineType) {
      dispatch(setSelectedEngineType(storedEngineType));
    }
  }, []);

  const handleEngineSelect = (selectedEngine: Engine) => {
    if (selectedEngine.id === engine?.id) {
      dispatch(setSelectedEngine(null));
    } else {
      dispatch(setSelectedEngine(selectedEngine));
    }
  };

  const handleTagSelect = (selectedTag: Tag) => {
    const tagExists = tag.some(tagItem => tagItem.id === selectedTag.id);

    if (tagExists) {
      dispatch(deleteSelectedTag(selectedTag.id));
    } else {
      dispatch(setSelectedTag(selectedTag));
    }
  };

  const handleEngineTypeSelect = (type: string) => {
    if (type === engineType) {
      dispatch(setSelectedEngineType(""));
    } else {
      dispatch(setSelectedEngineType(type));
    }
  };

  const handleItemSelect = (item: Item) => {
    switch (item.type) {
      case "engine":
        handleEngineSelect(item as Engine);
        break;
      case "tag":
        handleTagSelect(item as Tag);
        break;
      case "engineType":
        handleEngineTypeSelect(item.name);
        break;
    }
  };

  const isSelected = (item: Item) => {
    switch (item.type) {
      case "engine":
        return item.id === engine?.id;
      case "tag":
        return tag.some(tagItem => tagItem.id === item.id);
      case "engineType":
        return item.name === engineType;
      default:
        return false;
    }
  };

  return (
    <>
      <MyFavorites />
      <Collapsible
        title="Content type"
        items={contentTypeItems}
        key="contentType"
        onSelect={handleItemSelect}
        isSelected={isSelected}
      />
      <Collapsible
        title="Engines"
        items={engines || []}
        key="engines"
        onSelect={handleItemSelect}
        isSelected={isSelected}
      />
      <Collapsible
        title="Popular tags"
        items={tags || []}
        key="popularTags"
        onSelect={handleItemSelect}
        isSelected={isSelected}
        isTags
      />
    </>
  );
}

export default PromptsFilters;
