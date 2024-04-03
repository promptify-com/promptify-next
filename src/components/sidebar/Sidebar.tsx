import { useState } from "react";
import lazy from "next/dynamic";
import { useRouter } from "next/router";
import StickyNote2 from "@mui/icons-material/StickyNote2";
import Home from "@mui/icons-material/Home";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import HelpRounded from "@mui/icons-material/HelpRounded";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FolderSpecial from "@mui/icons-material/FolderSpecial";
import ExtensionRounded from "@mui/icons-material/ExtensionRounded";
import TryRounded from "@mui/icons-material/TryRounded";

import { useTheme } from "@mui/material/styles";
import useBrowser from "@/hooks/useBrowser";
import { useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import { BLOG_URL } from "@/common/constants";
import SidebarItem from "@/components/sidebar/SidebarItem";
import EditorIcon from "@/components/builder/Assets/EditorIcon";
import type { NavItem } from "@/common/types/sidebar";

const FiltersDrawerLazy = lazy(() => import("./PromptsFilter/FiltersDrawer"), {
  ssr: false,
});
const ChatsDrawerLazy = lazy(() => import("./ChatsHistory/ChatsDrawer"), {
  ssr: false,
});
const DocumentsDrawerLazy = lazy(() => import("./DocumentsFilter/DocumentsDrawer"), {
  ssr: false,
});
const PromptsReviewDrawerLazy = lazy(() => import("./PromptsReview/PromptsReviewDrawer"), {
  ssr: false,
});

function Sidebar() {
  const router = useRouter();
  const theme = useTheme();
  const { isMobile } = useBrowser();
  const [mouseHover, setMouseHover] = useState<boolean>(false);
  const pathname = router.pathname;
  const isPromptsPage = pathname.split("/")[1] === "explore";
  const isDocumentsPage = pathname.split("/")[1] === "sparks";
  const isChatPage = pathname.split("/")[1] === "chat";
  const isAutomationPage = pathname.split("/")[1] === "automation";
  const isPromptsReview = pathname.split("/")[2] === "prompts-review";
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
      href: "/chat",
      active: pathname === "/chat",
      external: false,
      reload: false,
    },
    {
      name: "Documents",
      href: isValidUser ? "/sparks" : "/signin",
      icon: <FolderSpecial />,
      active: pathname === "/sparks",
      external: false,
      reload: false,
    },
    {
      name: "Editor",
      href: isValidUser ? `/prompt-builder/create` : "/signin",
      icon: <EditorIcon color={pathname.includes("/prompt-builder") ? "#375CA9" : "#575E71"} />,
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

  const promptFilterExpanded = isPromptsPage && mouseHover;
  const chatsExpanded = isChatPage && mouseHover;
  const documentsFilterExpanded = isDocumentsPage && mouseHover;
  const promptsReviewFilterExpanded = isPromptsReview && mouseHover;

  return (
    <Grid
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
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
          bgcolor: "surfaceContainerLow",
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
      {isPromptsPage && <FiltersDrawerLazy expandedOnHover={promptFilterExpanded} />}
      {isChatPage && <ChatsDrawerLazy expandedOnHover={chatsExpanded} />}
      {isDocumentsPage && <DocumentsDrawerLazy expandedOnHover={documentsFilterExpanded} />}
      {isPromptsReview && <PromptsReviewDrawerLazy expandedOnHover={promptsReviewFilterExpanded} />}
    </Grid>
  );
}

export default Sidebar;
