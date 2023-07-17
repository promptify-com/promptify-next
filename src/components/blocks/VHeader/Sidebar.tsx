import React, { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useRouter } from "next/router";
import Link from "next/link";
import { AutoAwesome, Search } from "@mui/icons-material";
import { styled, Theme, CSSObject } from "@mui/material/styles";

import { LogoApp } from "@/assets/icons/LogoApp";
import { Engine, Tag } from "@/core/api/dto/templates";
import { SidebarIcon } from "@/assets/icons/Sidebar";
import { Collections } from "@/components/common/sidebar/Collections";
import { useGetCollectionTemplatesQuery } from "@/core/api/prompts";
import useToken from "@/hooks/useToken";
import { useGetCurrentUser } from "@/hooks/api/user";
import { ExploreFilterSideBar } from "@/components/explorer/ExploreFilterSideBar";
import {
  useGetEnginesQuery,
  useGetTagsPopularQuery,
} from "@/core/api/explorer";

interface SideBarProps {
  open: boolean;
  toggleSideBar: () => void;
}

const drawerWidth = 299;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `140px`,
  [theme.breakpoints.up("sm")]: {
    width: `90px`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const Sidebar: React.FC<SideBarProps> = ({ open, toggleSideBar }) => {
  const token = useToken();
  const [user] = useGetCurrentUser([token]);
  const { data: collections } = useGetCollectionTemplatesQuery(user?.id);
  const { data: tags } = useGetTagsPopularQuery();
  const { data: engines } = useGetEnginesQuery();
  const [expandedOnHover, setExpandedOnHover] = useState<boolean>(false);

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
    <Box>
      <Drawer
        open={open || expandedOnHover}
        onMouseEnter={() => setExpandedOnHover(true)}
        onMouseLeave={() => setExpandedOnHover(false)}
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          "& .MuiDrawer-paper": {
            my: "2vh",
            borderRadius: "0px 8px 8px 0px",
            height: "96vh",
            overflow: "hidden",
            boxSizing: "border-box",
            bgcolor: "white",
            border: "none",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          <Grid
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ padding: "16px 8px 16px 24px", minHeight: 48 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  paddingLeft: "6px",
                }}
              >
                <LogoApp width={30} />
                <Typography
                  sx={{ ml: "19px", opacity: open || expandedOnHover ? 1 : 0 }}
                  mt={0.5}
                >
                  Promptify
                </Typography>
              </Link>
            </Box>
            <IconButton
              onClick={toggleSideBar}
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
            <ListItem disablePadding key={item.name}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  mx: 1,
                  borderRadius: "8px",
                }}
                selected={item.active}
              >
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      open || expandedOnHover ? "initial" : "center",
                    padding: 6.5,
                    textDecoration: "none",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open || expandedOnHover ? 3 : "auto",
                      color: "onSurface",
                      justifyContent: "center",
                    }}
                  >
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                  <Typography
                    sx={{ opacity: open || expandedOnHover ? 1 : 0, mt: 0.5 }}
                    fontSize={14}
                    fontWeight={500}
                    color={"onSurface"}
                  >
                    {item.name}
                  </Typography>
                </Link>
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ opacity: pathname == "/explorer" ? 0 : 1 }} />
          <>
            {pathname == "/explorer" ? (
              <ExploreFilterSideBar
                engines={engines}
                tags={tags}
                sidebarOpen={open || expandedOnHover}
              />
            ) : (
              <Collections
                favCollection={collections}
                user={user}
                sidebarOpen={open || expandedOnHover}
              />
            )}
          </>
        </Box>
      </Drawer>
    </Box>
  );
};
