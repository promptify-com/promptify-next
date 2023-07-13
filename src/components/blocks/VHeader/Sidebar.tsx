import React, { useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { AutoAwesome, Search } from "@mui/icons-material";

import { LogoApp } from "@/assets/icons/LogoApp";
import { Engine, Tag } from "@/core/api/dto/templates";
import { SidebarIcon } from "@/assets/icons/Sidebar";

interface SideBarProps {
  tags?: Tag[];
  englines?: Engine[];
}

export const Sidebar: React.FC<SideBarProps> = ({ tags, englines }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const router = useRouter();
  const pathname = router.pathname;

  const navItems = [
    {
      name: "Browse",
      href: "/explorer",
      icon: <Search />,
      active: pathname == "/explorer",
    },
    {
      name: "My Sparks",
      href: "/",
      icon: <AutoAwesome />,
      active: pathname == "/",
    },
  ];

  return (
    <Drawer
      sx={{
        display: { xs: "none", md: "block" },
        width: "299px",
        "& .MuiDrawer-paper": {
          mt: "14px",
          borderRadius: "0px 8px 8px 0px",
          height: "97vh",
          width: 299,
          boxSizing: "border-box",
          bgcolor: "surface.1",
          border: "none",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Stack gap={1}>
        <Grid
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ padding: "16px 8px 16px 24px" }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Link
              href="/"
              style={{ textDecoration: "none", display: "flex", gap: "4px" }}
            >
              <LogoApp width={30} />
              <Typography mt={0.5}>Promptify</Typography>
            </Link>
          </Box>
          <IconButton
            sx={{
              border: "none",
              "&:hover": {
                backgroundColor: "surface.2",
              },
            }}
          >
            <SidebarIcon />
          </IconButton>
        </Grid>
        {navItems.map((item, i) => (
          <ListItem
            key={item.name}
            sx={{
              p: 0,
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
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    color: "onSurface",
                  }}
                >
                  <Icon sx={{ p: "11px" }}>{item.icon}</Icon>
                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    color={"onSurface"}
                  >
                    {item.name}
                  </Typography>
                </Grid>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
      </Stack>
    </Drawer>
  );
};
