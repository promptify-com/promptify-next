import StickyNote2 from "@mui/icons-material/StickyNote2";
import Home from "@mui/icons-material/Home";
import Drawer from "@mui/material/Drawer";
import { usePathname } from "next/navigation";
import React from "react";
import { useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import { ExtensionRounded, FolderSpecial, HelpRounded, Inventory2Rounded } from "@mui/icons-material";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import { NavItem } from "@/common/types/sidebar";
import SidebarItem from "./SidebarItem";
import { theme } from "@/theme";

function Sidebar() {
  const pathname = usePathname();
  const isPromptsPage = pathname.split("/")[1] === "explore";
  const isTemplatePage = pathname.split("/")[1] === "prompt";
  const isValidUser = useAppSelector(isValidUserFn);

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: <Home />,
      active: pathname === "/",
      external: false,
      reload: true,
    },
    {
      name: "Prompts",
      href: "/explore",
      icon: <StickyNote2 />,
      active: isPromptsPage,
      external: false,
      reload: true,
    },
    {
      name: "My Works",
      href: isValidUser ? "/sparks" : "/signin",
      icon: <FolderSpecial />,
      active: pathname === "/sparks",
      external: false,
      reload: false,
    },
  ];

  if (isTemplatePage) {
    const slug = pathname.split("/")[2];
    navItems.push({
      name: "Prompt Builder",
      href: `/prompt-builder/${slug}`,
      icon: <Inventory2Rounded />,
      active: pathname.includes("/prompt-builder"),
      external: true,
      reload: false,
    });
  }

  navItems.push(
    {
      name: "Chrome Extension",
      href: "#",
      icon: <ExtensionRounded />,
      active: false,
      external: false,
      reload: false,
    },
    {
      name: "Learn & Help",
      href: "https://blog.promptify.com/",
      icon: <HelpRounded />,
      active: false,
      external: true,
      reload: false,
    },
  );

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
        sx={{
          bgcolor: "surface.3",
          width: isPromptsPage ? theme.custom.defaultSidebarWidth : theme.custom.leftClosedSidebarWidth,
          padding: "8px 4px",
          height: "100vh",
        }}
      >
        <List>
          {navItems.slice(0, -1).map((item, index) => (
            <SidebarItem
              key={index}
              navItem={item}
              isPromptsPage={isPromptsPage}
            />
          ))}
        </List>

        <List>
          {navItems.length > 0 && (
            <SidebarItem
              navItem={navItems[navItems.length - 1]}
              isPromptsPage={isPromptsPage}
            />
          )}{" "}
        </List>
      </Grid>
    </Drawer>
  );
}

export default Sidebar;
