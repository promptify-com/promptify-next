import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { LocalStorage } from "@/common/storage";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import PromptsFilters from "@/components/sidebar/PromptsFilter/PromptsFilters";
import FilterFloatButton from "@/components/sidebar/FilterFloatButton";
import usePromptsFilter from "@/components/explorer/Hooks/usePromptsFilter";

interface Props {
  expandedOnHover?: boolean;
}

export default function PromptsDrawer({ expandedOnHover = false }: Props) {
  const dispatch = useAppDispatch();
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { resetFilters, filtersCount } = usePromptsFilter();

  const toggleSidebar = () => {
    dispatch(setStickyPromptsFilters(!isPromptsFiltersSticky));
  };

  useEffect(() => {
    const storedIsPromptsFiltersSticky = LocalStorage.get("isPromptsFiltersSticky");
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
          count={filtersCount}
          onClick={() => dispatch(setStickyPromptsFilters(!isPromptsFiltersSticky))}
          onClose={() => {
            resetFilters();
            dispatch(setStickyPromptsFilters(false));
            LocalStorage.set("isPromptsFiltersSticky", JSON.stringify(false));
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
