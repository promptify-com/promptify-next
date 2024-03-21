import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapsible from "@/components/sidebar/Collapsible";
import Storage from "@/common/storage";
import type { Item } from "@/components/sidebar/Collapsible";
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
import { isValidUserFn } from "@/core/store/userSlice";
import { contentTypeItems } from "@/components/sidebar/Constants";
import EnginesSelect from "@/components/sidebar/EnginesSelect";

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
        bgcolor: "surfaceContainerHigh",
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
  const isValidUser = useAppSelector(isValidUserFn);

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

  const handleEngineSelect = (selectedEngine: Engine | null) => {
    console.log(selectedEngine);
    dispatch(setSelectedEngine(selectedEngine));
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
    <Stack
      gap={2}
      py={"16px"}
    >
      {isValidUser && <MyFavorites />}
      <Collapsible
        title="Content type"
        items={contentTypeItems}
        key="contentType"
        onSelect={item => handleEngineTypeSelect(item.name)}
        isSelected={isSelected}
      />
      <EnginesSelect
        value={engine}
        onSelect={handleEngineSelect}
      />
      <Collapsible
        title="Popular tags"
        items={tags || []}
        key="popularTags"
        onSelect={item => handleTagSelect(item as Tag)}
        isSelected={isSelected}
      />
    </Stack>
  );
}

export default PromptsFilters;
