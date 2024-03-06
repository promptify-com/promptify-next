import { useRouter } from "next/router";
import StickyNote2 from "@mui/icons-material/StickyNote2";
import Home from "@mui/icons-material/Home";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import HelpRounded from "@mui/icons-material/HelpRounded";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FolderSpecial from "@mui/icons-material/FolderSpecial";
import ExtensionRounded from "@mui/icons-material/ExtensionRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import TryRounded from "@mui/icons-material/TryRounded";
import { useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import SidebarItem from "./SidebarItem";
import { theme } from "@/theme";
import useBrowser from "@/hooks/useBrowser";
import { BLOG_URL } from "@/common/constants";
import { useState } from "react";
import lazy from "next/dynamic";
import type { NavItem } from "@/common/types/sidebar";

const FiltersDrawerLazy = lazy(() => import("./FiltersDrawer"), {
  ssr: false,
});

function Sidebar() {
  const router = useRouter();
  const { isMobile } = useBrowser();
  const [expandedOnHover, setExpandedOnHover] = useState<boolean>(false);
  const pathname = router.pathname;
  const isPromptsPage = pathname.split("/")[1] === "explore";
  const isChatPage = pathname.split("/")[1] === "chat";
  const isAutomationPage = pathname.split("/")[1] === "automation";
  const isValidUser = useAppSelector(isValidUserFn);
  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: <Home />,
      active: pathname === "/",
      external: false,
      reload: false,
    },
    {
      name: "Prompts",
      href: "/explore",
      icon: <StickyNote2 />,
      active: isPromptsPage,
      external: false,
      reload: false,
    },
    {
      name: "Chats",
      icon: <TryRounded />,
      href: "/chats",
      active: pathname === "/chats",
      external: false,
      reload: false,
    },
    {
      name: "My Works",
      href: isValidUser ? "/sparks" : "/signin",
      icon: <FolderSpecial />,
      active: pathname === "/sparks",
      external: false,
      reload: false,
    },
    {
      name: "Prompt Builder",
      href: isValidUser ? `/prompt-builder/create` : "/signin",
      icon: <Inventory2Rounded />,
      active: pathname.includes("/prompt-builder"),
      external: isValidUser,
      reload: false,
    },
    {
      name: "GPTs",
      href: "/automation",
      icon: <ElectricBoltIcon />,
      active: isAutomationPage,
      external: false,
      reload: false,
    },
    {
      name: "Chrome Extension",
      href: "#",
      icon: <ExtensionRounded />,
      active: false,
      external: false,
      reload: false,
    },
  ];
  const learnHelpNavItem = {
    name: "Learn & Help",
    href: BLOG_URL,
    icon: <HelpRounded />,
    active: false,
    external: true,
    reload: false,
  };

  if (isMobile) {
    return null;
  }

  return (
    <Grid
      onMouseEnter={() => {
        if (!isPromptsPage) {
          return;
        }

        setExpandedOnHover(true);
      }}
      onMouseLeave={() => {
        if (!isPromptsPage) {
          return;
        }

        setExpandedOnHover(false);
      }}
      sx={{
        display: { xs: "none", md: "flex" },
        "flex-direction": "column",
        height: "100%",
        flex: "1 0 auto",
        "z-index": 1200,
        position: "fixed",
        top: 0,
        outline: 0,
        left: 0,
        borderRight: "none",
      }}
    >
      <Grid
        display={"flex"}
        flexDirection="column"
        justifyContent="space-between"
        className="sidebar-list"
        sx={{
          overflow: "none",
          bgcolor: "surface.3",
          width: theme.custom.leftClosedSidebarWidth,
          padding: "8px 4px",
          height: "100vh",
        }}
      >
        <List>
          {navItems.map(item => (
            <SidebarItem
              key={item.name.replace(" ", "-")}
              navItem={item}
            />
          ))}
        </List>
        <List sx={{ p: 0 }}>
          <SidebarItem navItem={learnHelpNavItem} />
        </List>
      </Grid>
      {(isPromptsPage || isChatPage) && <FiltersDrawerLazy expandedOnHover={expandedOnHover} />}
    </Grid>
  );
}

export default Sidebar;
