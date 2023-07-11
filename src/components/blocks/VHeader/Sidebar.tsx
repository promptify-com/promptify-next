import React from "react";
import {
  Box,
  Drawer,
  Icon,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  AutoStoriesOutlined,
  BookmarkAddOutlined,
  HomeOutlined,
  Search,
  Support,
} from "@mui/icons-material";

import { LogoApp } from "@/assets/icons/LogoApp";

interface Props {
  transparent?: boolean;
  fixed?: boolean;
  keyWord?: string;
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
  handleKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Sidebar: React.FC<Props> = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <HomeOutlined />,
      active: pathname == "/",
    },
    {
      name: "Explore",
      href: "/explorer",
      icon: <Search />,
      active: pathname == "/explorer",
    },
    {
      name: "Learn",
      href: "/",
      icon: <AutoStoriesOutlined />,
      active: pathname == "/",
    },
    {
      name: "Favorites",
      href: "/",
      icon: <BookmarkAddOutlined />,
      active: pathname == "/",
    },
    { name: "Help", href: "/", icon: <Support />, active: pathname == "/" },
  ];

  return (
    <Drawer
      sx={{
        display: { xs: "none", md: "block" },
        width: "96px",
        "& .MuiDrawer-paper": {
          width: 96,
          boxSizing: "border-box",
          bgcolor: "surface.1",
          border: "none",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Stack height={"100%"} gap={1}>
        <Box sx={{ p: "24px", textAlign: "center" }}>
          <Link href="/">
            <LogoApp width={30} />
          </Link>
        </Box>
        {navItems.map((item, i) => (
          <ListItem
            key={i}
            sx={{
              p: 0,
              mt: i === navItems.length - 1 ? "auto" : 0,
            }}
          >
            <ListItemButton
              sx={{ mx: "8px", borderRadius: "8px" }}
              selected={item.active}
            >
              <Link
                href={item.href}
                style={{
                  textDecoration: "none",
                }}
              >
                <Stack
                  sx={{
                    flex: 1,
                    alignItems: "center",
                    textAlign: "center",
                    color: "onSurface",
                  }}
                >
                  <Icon sx={{ p: "11px" }}>{item.icon}</Icon>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={"onSurface"}
                  >
                    {item.name}
                  </Typography>
                </Stack>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </Stack>
    </Drawer>
  );
};
