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

function Sidebar() {
  const pathname = usePathname();
  const isExplorePage = pathname.split("/")[1] === "explore";
  const isBuilderPage = pathname.split("/")[1] === "prompt-builder";
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
      active: isExplorePage,
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
      name: "Prompt builder",
      href: "/prompt-builder/personal-performance-acc237c8?viewport=desktop",
      icon: <Inventory2Rounded />,
      active: isBuilderPage,
      external: true,
      reload: false,
    },
    {
      name: "Chrome Extension",
      href: "#",
      icon: <ExtensionRounded />,
      active: false,
      external: true,
      reload: false,
    },
  ];

  const BottomList: NavItem[] = [
    {
      name: "Learn & Help",
      href: "https://blog.promptify.com/",
      icon: <HelpRounded />,
      active: false,
      external: true,
      reload: false,
    },
  ];

  return (
    <Drawer
      open
      variant="permanent"
      anchor="left"
      sx={{
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
          width: "96px",
          padding: "8px 4px",
          height: "100vh",
        }}
      >
        <List>
          {navItems.map((item, index) => (
            <SidebarItem
              key={index}
              navItem={item}
            />
          ))}
        </List>

        <List>
          {BottomList.map((item, index) => (
            <SidebarItem
              key={index}
              navItem={item}
            />
          ))}
        </List>
      </Grid>
    </Drawer>
  );
}

export default Sidebar;
