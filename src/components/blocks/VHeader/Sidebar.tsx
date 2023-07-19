import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
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
import {
  AutoAwesome,
  ExpandLess,
  ExpandMore,
  MenuBookRounded,
  Search,
} from "@mui/icons-material";
import { styled, Theme, CSSObject } from "@mui/material/styles";

import { LogoApp } from "@/assets/icons/LogoApp";
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
import { SideBarCloseIcon } from "@/assets/icons/SideBarClose";
import { useGetCurrentUserQuery } from "@/core/api/user";

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
  const router = useRouter();

  const pathname = router.pathname;
  const splittedPath = pathname.split("/");

  const isExplorePage = splittedPath[1] == "explore";

  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery(token);

  const { data: collections, isLoading: isCollectionsLoading } =
    useGetCollectionTemplatesQuery(user?.id as number, {
      skip: !user,
    });
  const { data: tags } = useGetTagsPopularQuery();
  const { data: engines } = useGetEnginesQuery();

  const [expandedOnHover, setExpandedOnHover] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    if (expandedOnHover || open) {
      return;
    }
    setShowFilters(false);
  }, [expandedOnHover, open]);

  const navItems = [
    {
      name: "Browse",
      href: "/explore",
      icon: <Search />,
      active: isExplorePage,
    },
    {
      name: "My Sparks",
      href: "/",
      icon: <AutoAwesome />,
      active: pathname == "/",
    },
    {
      name: "Learn",
      href: "/",
      icon: <MenuBookRounded />,
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
            boxShadow:
              !open && expandedOnHover
                ? "0px 7px 8px -4px #00000033, 0px 12px 17px 2px #00000024, 0px 5px 22px 4px #0000001F"
                : "",
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
              {!open && expandedOnHover ? (
                <SideBarCloseIcon />
              ) : (
                <SidebarIcon />
              )}
            </IconButton>
          </Grid>
          {navItems.map((item, i) => (
            <Grid key={item.name}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    borderRadius: "8px",
                    mx: 1,
                  }}
                  selected={item.active}
                  onClick={() =>
                    item.name == "Browse" && setShowFilters(!showFilters)
                  }
                >
                  <Link
                    href={isExplorePage ? "#" : item.href}
                    style={{
                      textDecoration: "none",
                      padding: 6.5,
                      display: "flex",
                      width: open || expandedOnHover ? "100%" : "auto",
                      alignItems: "center",
                      justifyContent:
                        open || expandedOnHover ? "initial" : "center",
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
                      sx={{
                        opacity: open || expandedOnHover ? 1 : 0,
                        mt: 0.5,
                      }}
                      fontSize={14}
                      fontWeight={500}
                      color={"onSurface"}
                    >
                      {item.name}
                    </Typography>
                  </Link>
                  {item.name == "Browse" &&
                    isExplorePage &&
                    (showFilters ? (
                      <ExpandLess sx={{ mr: -1, color: "text.secondary" }} />
                    ) : (
                      <ExpandMore sx={{ mr: -1, color: "text.secondary" }} />
                    ))}
                </ListItemButton>
              </ListItem>
              <Collapse
                in={showFilters && isExplorePage && item.name == "Browse"}
                timeout={"auto"}
                unmountOnExit
              >
                <ExploreFilterSideBar
                  engines={engines}
                  tags={tags}
                  sidebarOpen={open || expandedOnHover}
                />
              </Collapse>
            </Grid>
          ))}
          <Divider />
          <Collections
            favCollection={collections}
            collectionLoading={isCollectionsLoading}
            userLoading={userLoading}
            user={user}
            sidebarOpen={open || expandedOnHover}
          />
        </Box>
      </Drawer>
    </Box>
  );
};
