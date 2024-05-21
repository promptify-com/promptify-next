import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyDocumentsFilters } from "@/core/store/sidebarSlice";
import LocalStorage from "@/common/Storage/LocalStorage";
import { useEffect, useState } from "react";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import DocumentsFilters from "./DocumentsFilters";
import { Stack } from "@mui/material";
import FilterFloatButton from "@/components/sidebar/FilterFloatButton";
import useBrowser from "@/hooks/useBrowser";
import { countSelectedFilters, initialState as initialDocumentsState } from "@/core/store/documentsSlice";

interface Props {
  expandedOnHover?: boolean;
}

export default function DocumentsDrawer({ expandedOnHover = false }: Props) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);
  const filters = useAppSelector(state => state.documents?.filter ?? initialDocumentsState.filter);
  const filterCount = countSelectedFilters(filters);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const toggleSidebar = () => {
    dispatch(setStickyDocumentsFilters(!isDocumentsFiltersSticky));
  };

  useEffect(() => {
    if (isMobile) return;

    const isDocumentsFiltersSticky = Boolean(LocalStorage.get("isDocumentsFiltersSticky"));
    if (isDocumentsFiltersSticky) {
      dispatch(setStickyDocumentsFilters(isDocumentsFiltersSticky));
    }
  }, []);

  const isExpanded = isDocumentsFiltersSticky || (expandedOnHover && !isButtonHovered);

  return (
    <Stack position={"relative"}>
      {isMobile && (
        <Stack
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <FilterFloatButton
            expanded={isExpanded}
            onClick={() => dispatch(setStickyDocumentsFilters(!isDocumentsFiltersSticky))}
            count={filterCount}
          />
        </Stack>
      )}
      <DrawerContainer
        title="Documents"
        expanded={isExpanded}
        toggleExpand={toggleSidebar}
        sticky={isDocumentsFiltersSticky}
        onClose={() => dispatch(setStickyDocumentsFilters(false))}
      >
        <DocumentsFilters />
      </DrawerContainer>
    </Stack>
  );
}
