import { useEffect } from "react";
import Stack from "@mui/material/Stack";

import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Storage from "@/common/storage";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import PromptsFilters from "@/components/sidebar/PromptsFilter/PromptsFilters";
import FilterFloatButton from "@/components/sidebar/PromptsFilter/FilterFloatButton";

interface Props {
  expandedOnHover: boolean;
}

export default function FiltersDrawer({ expandedOnHover }: Props) {
  const dispatch = useAppDispatch();
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);

  const toggleSidebar = () => {
    dispatch(setStickyPromptsFilters(!isPromptsFiltersSticky));
  };

  useEffect(() => {
    const isPromptsFiltersSticky = Storage.get("isPromptsFiltersSticky");
    if (isPromptsFiltersSticky) {
      dispatch(setStickyPromptsFilters(isPromptsFiltersSticky));
    }
  }, []);

  const isExpanded = isPromptsFiltersSticky || expandedOnHover;
  return (
    <Stack position={"relative"}>
      <FilterFloatButton expanded={isExpanded} />
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
