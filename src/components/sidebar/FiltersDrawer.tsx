import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import Storage from "@/common/storage";
import { useEffect } from "react";
import DrawerContainer from "./DrawerContainer";
import PromptsFilters from "./PromptsFilters";

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
    if (isPromptsFiltersSticky === null) {
      dispatch(setStickyPromptsFilters(true));
    } else {
      dispatch(setStickyPromptsFilters(isPromptsFiltersSticky));
    }
  }, []);

  return (
    <DrawerContainer
      title="Prompts"
      expanded={isPromptsFiltersSticky || expandedOnHover}
      toggleExpand={toggleSidebar}
      sticky={isPromptsFiltersSticky}
    >
      <PromptsFilters />
    </DrawerContainer>
  );
}
