import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { useRouteChangeOverlay } from "@/hooks/useRouteChangeOverlay";
import LoadingOverlay from "@/components/design-system/LoadingOverlay";
import Header from "@/components/SidebarMobile/Header";
import Navigations from "@/components/SidebarMobile/Navigations";
import ProfileLinks from "@/components/SidebarMobile/ProfileLinks";
import type { SidebarType } from "@/components/SidebarMobile/Types";

interface SideBarMobileProps {
  type: SidebarType;
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
  setSidebarType: (value: React.SetStateAction<SidebarType>) => void;
}

export const SideBarMobile: React.FC<SideBarMobileProps> = ({
  type,
  openDrawer,
  onCloseDrawer,
  onOpenDrawer,
  setSidebarType,
}) => {
  const { showOverlay } = useRouteChangeOverlay({ onCloseDrawerCallback: onCloseDrawer });

  return (
    <SwipeableDrawer
      anchor={"top"}
      open={openDrawer}
      onClose={onCloseDrawer}
      onOpen={onOpenDrawer}
      PaperProps={{
        style: { borderRadius: "0px 0px 8px 8px" },
      }}
    >
      {showOverlay && <LoadingOverlay />}

      <Header
        type={type}
        setSidebarType={setSidebarType}
        onCloseDrawer={onCloseDrawer}
      />
      {type === "navigation" && <Navigations onCloseDrawer={onCloseDrawer} />}
      {type === "profile" && <ProfileLinks onCloseDrawer={onCloseDrawer} />}
    </SwipeableDrawer>
  );
};
