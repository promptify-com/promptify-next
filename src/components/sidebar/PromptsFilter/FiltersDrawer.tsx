import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Storage from "@/common/storage";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import PromptsFilters from "@/components/sidebar/PromptsFilter/PromptsFilters";
import FilterFloatButton from "@/components/sidebar/FilterFloatButton";
import { countSelectedFilters, resetFilters } from "@/core/store/filtersSlice";

interface Props {
  expandedOnHover: boolean;
}

export default function FiltersDrawer({ expandedOnHover }: Props) {
  const dispatch = useAppDispatch();
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const filters = useAppSelector(state => state.filters);
  const filterCount = countSelectedFilters(filters);

  const toggleSidebar = () => {
    dispatch(setStickyPromptsFilters(!isPromptsFiltersSticky));
  };

  useEffect(() => {
    const storedIsPromptsFiltersSticky = Storage.get("isPromptsFiltersSticky");
    if (storedIsPromptsFiltersSticky !== null) {
      dispatch(setStickyPromptsFilters(JSON.parse(storedIsPromptsFiltersSticky)));
    }
  }, [dispatch]);

  const isExpanded = isPromptsFiltersSticky || (expandedOnHover && !isButtonHovered);

  return (
    <Stack position={"relative"}>
      <Stack
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <FilterFloatButton
          expanded={isExpanded}
          count={filterCount}
          onClick={() => dispatch(setStickyPromptsFilters(!isPromptsFiltersSticky))}
          onClose={() => {
            dispatch(resetFilters());
            dispatch(setStickyPromptsFilters(false));
            Storage.set("isPromptsFiltersSticky", JSON.stringify(false));
          }}
        />
      </Stack>
      {isExpanded && (
        <DrawerContainer
          title="Prompts"
          expanded={isExpanded}
          toggleExpand={toggleSidebar}
          sticky={isPromptsFiltersSticky}
        >
          <PromptsFilters />
        </DrawerContainer>
      )}
    </Stack>
  );
}
