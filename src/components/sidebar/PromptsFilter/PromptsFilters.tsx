import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { contentTypeItems } from "@/components/sidebar/Constants";
import EnginesSelect from "@/components/sidebar/EnginesSelect";
import Collapsible from "@/components/sidebar/Collapsible";
import StaticFilterItems from "@/components/sidebar/PromptsFilter/StaticFilterItems";
import type { Item } from "@/components/sidebar/Collapsible";
import type { Engine, EngineType, Tag } from "@/core/api/dto/templates";
import usePromptsFilter from "@/components/explorer/Hooks/usePromptsFilter";

function PromptsFilters() {
  const { data: tags } = useGetTagsPopularQuery();
  const { filters, handleSelectEngine, handleSelectEngineType, handleSelectTag } = usePromptsFilter();
  const { engine, engineType, tag } = filters;

  const handleEngineSelect = (selectedEngine: Engine | null) => {
    handleSelectEngine(selectedEngine);
  };

  const handleTagSelect = (selectedTag: Tag) => {
    handleSelectTag(selectedTag);
  };

  const handleEngineTypeSelect = (type: EngineType) => {
    handleSelectEngineType(type);
  };

  const isSelected = (item: Item) => {
    switch (item.type) {
      case "engine":
        return item.id === engine?.id;
      case "tag":
        return tag.some(tagItem => tagItem.id === item.id);
      case "EngineType":
        return engineType.some(engine => engine.id === item.id);
      default:
        return false;
    }
  };

  return (
    <Stack
      gap={2}
      py={"16px"}
    >
      <StaticFilterItems />
      <Collapsible
        title="Content type"
        key="contentType"
        items={contentTypeItems}
        onSelect={item => handleEngineTypeSelect({ id: item.id, label: item.name })}
        isSelected={isSelected}
      />
      <EnginesSelect
        value={engine}
        onSelect={handleEngineSelect}
      />
      <Collapsible
        title="Popular tags"
        key="popularTags"
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={"8px"}
          flexWrap={"wrap"}
        >
          {tags?.map(tag => (
            <Box
              key={tag.id}
              onClick={() => handleTagSelect(tag)}
            >
              <Chip
                label={tag.name}
                clickable
                sx={{
                  borderRadius: "4px",
                  bgcolor: isSelected(tag) ? "rgba(55, 92, 169, 0.08)" : "surfaceContainer",
                  fontSize: 14,
                  fontWeight: 500,
                  p: "8px",
                }}
              />
            </Box>
          ))}
        </Stack>
      </Collapsible>
    </Stack>
  );
}

export default PromptsFilters;
