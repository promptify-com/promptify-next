import StickyNote2 from "@mui/icons-material/StickyNote2";
import Home from "@mui/icons-material/Home";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import ExtensionRounded from "@mui/icons-material/ExtensionRounded";
import FolderSpecial from "@mui/icons-material/FolderSpecial";
import HelpRounded from "@mui/icons-material/HelpRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import Route from "@mui/icons-material/Route";
import { NavItem } from "@/common/types/sidebar";
import SidebarItem from "./SidebarItem";
import { theme } from "@/theme";
import type { NavItem } from "@/common/types/sidebar";

function Sidebar() {
  const pathname = usePathname();
  const isPromptsPage = pathname.split("/")[1] === "explore";
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
      name: "Automation",
      href: "/automation",
      icon: <Route />,
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
    href: "https://blog.promptify.com/",
    icon: <HelpRounded />,
    active: false,
    external: true,
    reload: false,
  };

  return (
    <Drawer
      open
      variant="permanent"
      anchor="left"
      sx={{
        display: { xs: "none", md: "flex" },
        "& .MuiDrawer-paper": {
          borderRight: "none",
        },
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
    </Drawer>
  );
}

export default Sidebar;
