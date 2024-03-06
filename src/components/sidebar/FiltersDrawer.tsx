import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useRouter } from "next/router";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import lazy from "next/dynamic";
import Storage from "@/common/storage";
import { useEffect } from "react";
import DrawerContainer from "./DrawerContainer";

const PromptsFiltersLazy = lazy(() => import("./PromptsFilters"), {
  ssr: false,
});

interface Props {
  expandedOnHover: boolean;
}

export default function FiltersDrawer({ expandedOnHover }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = router.pathname;
  const isPromptsPage = pathname.split("/")[1] === "explore";
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const toggleSidebar = () => {
    if (isPromptsPage) {
      dispatch(setStickyPromptsFilters(!isPromptsFiltersSticky));
      if (!isPromptsFiltersSticky) {
        Storage.set("isPromptsFiltersSticky", String(!isPromptsFiltersSticky));
      } else {
        Storage.remove("isPromptsFiltersSticky");
      }
    }
  };

  useEffect(() => {
    const isPromptsFiltersSticky = Storage.get("isPromptsFiltersSticky");
    if (isPromptsFiltersSticky) {
      dispatch(setStickyPromptsFilters(isPromptsFiltersSticky));
    }
  }, []);

  return (
    <DrawerContainer
      title="Prompts"
      expanded={isPromptsFiltersSticky || expandedOnHover}
      toggleExpand={toggleSidebar}
    >
      {isPromptsPage && <PromptsFiltersLazy />}
    </DrawerContainer>
  );
}
