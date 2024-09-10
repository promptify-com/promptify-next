"use client";
import React from "react";
// Materiel ui
import { Stack } from "@mui/material";
import { Home, FolderSpecial, ExtensionRounded, ElectricBolt, TryRounded, StickyNote2 } from "@mui/icons-material";
import EditorIcon from "@/components/builder/Assets/EditorIcon";
import Book3 from "@/assets/icons/Book3";
// Components
import NavItem, { NavItemType } from "./nav_item";

export default function NavItems() {
  //
  const navItems: NavItemType[] = [
    {
      name: "Home",
      // href: "/",
      Icon: Home,
      // active: pathname === "/",
      // external: false,
      // reload: false,
    },
    {
      name: "AI Apps",
      // href: "/apps",
      Icon: ElectricBolt,
      // active: isAutomationPage,
      // external: false,
      // reload: false,
      // sx: { whiteSpace: "nowrap" },
    },
    {
      name: "Chats",
      Icon: TryRounded,
      // href: "/chat",
      // active: pathname === "/chat",
      // external: false,
      // reload: false,
    },
    {
      name: "Prompts",
      // href: "/explore",
      Icon: StickyNote2,
      // active: isPromptsPage,
      // external: false,
      // reload: false,
    },
    {
      name: "Documents",
      // href: isValidUser ? "/sparks" : "/signin",
      Icon: FolderSpecial,
      // active: pathname === "/sparks",
      // external: false,
      // reload: false,
    },
    {
      name: "Editor",
      // href: isValidUser ? `/prompt-builder/create` : "/signin",
      Icon: EditorIcon,
      // active: pathname.includes("/prompt-builder"),
      // external: isValidUser,
      // reload: false,
    },
    {
      name: "Chrome Extension",
      // href: "#",
      Icon: ExtensionRounded,
      // active: false,
      // external: false,
      // reload: false,
    },
  ];
  const HelpItem: NavItemType = {
    name: "Learn",
    // href: "https://blog.promptify.com/",
    Icon: Book3,
    // active: isLearnPage,
    // external: true,
    // reload: false,
  };

  return (
    <Stack sx={{ height: "100%", border: "none", width: 90 }}>
      <Stack
        sx={{ flexGrow: 1, my: 2 }}
        spacing={1}
      >
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            item={item}
          />
        ))}
      </Stack>
      <NavItem item={HelpItem} />
    </Stack>
  );
}
