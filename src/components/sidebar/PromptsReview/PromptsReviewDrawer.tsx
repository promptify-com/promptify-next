import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";

import { setStickyPromptsReviewFilters } from "@/core/store/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { LocalStorage } from "@/common/storage";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import PromptsFilters from "@/components/sidebar/PromptsFilter/PromptsFilters";
import PromptsReviewFloatButton from "./PromptsReviewFloatButton";
import PromptsReviewFilters from "./PromptsReviewFilters";

interface Props {
  expandedOnHover: boolean;
}

export default function PromptsReviewDrawer({ expandedOnHover }: Props) {
  const dispatch = useAppDispatch();
  const isPromptsReviewFiltersSticky = useAppSelector(state => state.sidebar.isPromptsReviewFiltersSticky);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const toggleSidebar = () => {
    dispatch(setStickyPromptsReviewFilters(!isPromptsReviewFiltersSticky));
  };

  useEffect(() => {
    const storedPromptsReviewFilter = LocalStorage.get("isPromptsReviewFiltersSticky");
    if (storedPromptsReviewFilter !== null) {
      dispatch(setStickyPromptsReviewFilters(JSON.parse(storedPromptsReviewFilter)));
    }
  }, []);

  const isExpanded = isPromptsReviewFiltersSticky || (expandedOnHover && !isButtonHovered);

  return (
    <Stack position={"relative"}>
      <Stack
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <PromptsReviewFloatButton expanded={isExpanded} />
      </Stack>
      {isExpanded && (
        <DrawerContainer
          title="Prompts Review"
          expanded={isExpanded}
          toggleExpand={toggleSidebar}
          sticky={isPromptsReviewFiltersSticky}
        >
          <PromptsReviewFilters />
        </DrawerContainer>
      )}
    </Stack>
  );
}
