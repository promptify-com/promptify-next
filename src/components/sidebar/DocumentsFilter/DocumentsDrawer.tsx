import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyDocumentsFilters } from "@/core/store/sidebarSlice";
import Storage from "@/common/storage";
import { useEffect } from "react";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import DocumentsFilters from "./DocumentsFilters";

interface Props {
  expandedOnHover: boolean;
}

export default function FiltersDrawer({ expandedOnHover }: Props) {
  const dispatch = useAppDispatch();
  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  const toggleSidebar = () => {
    dispatch(setStickyDocumentsFilters(!isDocumentsFiltersSticky));
  };

  useEffect(() => {
    const isDocumentsFiltersSticky = Boolean(Storage.get("isDocumentsFiltersSticky"));
    if (isDocumentsFiltersSticky) {
      dispatch(setStickyDocumentsFilters(isDocumentsFiltersSticky));
    }
  }, []);

  return (
    <DrawerContainer
      title="Documents"
      expanded={isDocumentsFiltersSticky || expandedOnHover}
      toggleExpand={toggleSidebar}
      sticky={isDocumentsFiltersSticky}
    >
      <DocumentsFilters />
    </DrawerContainer>
  );
}
