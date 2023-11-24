import StickyNote2 from "@mui/icons-material/StickyNote2";
import Home from "@mui/icons-material/Home";
import Drawer from "@mui/material/Drawer";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
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
  const slug = isTemplatePage ? pathname.split("/")[2] : "create";
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
    {
      name: "Prompt Builder",
      href: isValidUser ? `/prompt-builder/${slug}` : "/signin",
      icon: <Inventory2Rounded />,
      active: pathname.includes("/prompt-builder"),
      external: isValidUser,
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
