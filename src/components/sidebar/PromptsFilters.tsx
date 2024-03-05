import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapsible from "./Collapsible";
import Storage from "@/common/storage";

import type { Item } from "./Collapsible";
import { useEffect, useState } from "react";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";
import { setSelectedEngine, setSelectedTag, deleteSelectedTag, setSelectedEngineType } from "@/core/store/filtersSlice";
import type { Engine, Tag } from "@/core/api/dto/templates";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";

const contentTypeItems = [
  { name: "Text", id: 1 },
  { name: "Image", id: 2 },
  { name: "Video", id: 3 },
  { name: "Audio", id: 4 },
] as const satisfies Item[];

function MyFavorites() {
  const [checked, setChecked] = useState(false);

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
        checked={checked}
        name="my_favorites"
        value={""}
        onChange={(_, _checked) => setChecked(_checked)}
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
      Storage.remove("engineFilter");
    } else {
      dispatch(setSelectedEngine(selectedEngine));
      Storage.set("engineFilter", JSON.stringify(selectedEngine));
    }
  };

  const handleTagSelect = (selectedTag: Tag) => {
    const tagExists = tag.some(tagItem => tagItem.id === selectedTag.id);
    if (tagExists) {
      dispatch(deleteSelectedTag(selectedTag.id));
      Storage.remove("tagFilter");
    } else {
      dispatch(setSelectedTag(selectedTag));
      Storage.set("tagFilter", JSON.stringify([...tag, selectedTag]));
    }
  };

  const handleEngineTypeSelect = (type: string) => {
    if (type === engineType) {
      dispatch(setSelectedEngineType(""));
      Storage.remove("engineTypeFilter");
    } else {
      dispatch(setSelectedEngineType(type));
      Storage.set("engineTypeFilter", type);
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

  const addType = (items: Item[], type: string) => items.map(item => ({ ...item, type }));

  return (
    <>
      <MyFavorites />
      <Collapsible
        title="Content type"
        items={addType(contentTypeItems, "engineType")}
        key="contentType"
        onSelect={handleItemSelect}
        isSelected={isSelected}
      />
      <Collapsible
        title="Engines"
        items={addType(engines || [], "engine")}
        key="engines"
        onSelect={handleItemSelect}
        isSelected={isSelected}
      />
      <Collapsible
        title="Popular tags"
        items={addType(tags || [], "tag")}
        key="popularTags"
        onSelect={handleItemSelect}
        isSelected={isSelected}
      />
    </>
  );
}

export default PromptsFilters;
