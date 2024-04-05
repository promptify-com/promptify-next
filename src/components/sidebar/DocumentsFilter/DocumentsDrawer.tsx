import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyDocumentsFilters } from "@/core/store/sidebarSlice";
import Storage from "@/common/storage";
import { useEffect, useState } from "react";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import DocumentsFilters from "./DocumentsFilters";
import { Stack } from "@mui/material";
import FilterFloatButton from "@/components/sidebar/FilterFloatButton";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  expandedOnHover?: boolean;
}

export default function DocumentsDrawer({ expandedOnHover = false }: Props) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const toggleSidebar = () => {
    dispatch(setStickyDocumentsFilters(!isDocumentsFiltersSticky));
  };

  useEffect(() => {
    const isDocumentsFiltersSticky = Boolean(Storage.get("isDocumentsFiltersSticky"));
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
          />
        </Stack>
      )}
      <DrawerContainer
        title="Documents"
        expanded={isExpanded}
        toggleExpand={toggleSidebar}
        sticky={isDocumentsFiltersSticky}
      >
        <DocumentsFilters />
      </DrawerContainer>
    </Stack>
  );
}
