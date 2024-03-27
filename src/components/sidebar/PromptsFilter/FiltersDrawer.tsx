import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import Storage from "@/common/storage";
import { useEffect } from "react";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import PromptsFilters from "./PromptsFilters";
import Stack from "@mui/material/Stack";
import FilterFloatButton from "./FilterFloatButton";

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
      <DrawerContainer
        title="Prompts"
        expanded={isExpanded}
        toggleExpand={toggleSidebar}
        sticky={isPromptsFiltersSticky}
      >
        <PromptsFilters />
      </DrawerContainer>
    </Stack>
  );
}
