import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Storage from "@/common/storage";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import PromptsFilters from "@/components/sidebar/PromptsFilter/PromptsFilters";
import FilterFloatButton from "@/components/sidebar/FilterFloatButton";
import { countSelectedFilters } from "@/core/store/filtersSlice";
import usePromptsFilter from "@/components/explorer/Hooks/usePromptsFilter";

interface Props {
  expandedOnHover?: boolean;
}

export default function PromptsDrawer({ expandedOnHover = false }: Props) {
  const dispatch = useAppDispatch();
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { filters, resetFilters } = usePromptsFilter();
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
            resetFilters();
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
          onClose={() => dispatch(setStickyPromptsFilters(false))}
        >
          <PromptsFilters />
        </DrawerContainer>
      )}
    </Stack>
  );
}
