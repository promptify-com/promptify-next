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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AutoAwesome, ExpandLess, ExpandMore, Home, MenuBookRounded, Search } from "@mui/icons-material";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { LogoApp } from "@/assets/icons/LogoApp";
import { SidebarIcon } from "@/assets/icons/Sidebar";
import { Collections } from "@/components/common/sidebar/Collections";
import { useGetCollectionTemplatesQuery } from "@/core/api/collections";
import { ExploreFilterSideBar } from "@/components/explorer/ExploreFilterSideBar";
import { SideBarCloseIcon } from "@/assets/icons/SideBarClose";
import { useSelector } from "react-redux";
import { isValidUserFn } from "@/core/store/userSlice";
import { RootState } from "@/core/store";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";

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
    width: `86px`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open",
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
  const pathname = usePathname();
  const isExplorePage = pathname.split("/")[1] === "explore";
  const isValidUser = useSelector(isValidUserFn);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { data: collections, isLoading: isCollectionsLoading } = useGetCollectionTemplatesQuery(
    currentUser?.favorite_collection_id as number,
    {
      skip: !isValidUser,
    },
  );
  const { tags, engines } = useGetTemplatesByFilter();
  const [expandedOnHover, setExpandedOnHover] = useState<boolean>(false);
  const [showExpandIcon, setShowExpandIcon] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);

  useEffect(() => {
    if (expandedOnHover || open) {
      return;
    }
    setShowFilters(false);
  }, [expandedOnHover, open]);

  const navItems = [
    {
      name: "Homepage",
      href: "/",
      icon: <Home />,
      active: pathname === "/",
      external: false,
    },
    {
      name: "Browse",
      href: "/explore",
      icon: <Search />,
      active: isExplorePage,
      external: false,
    },
    {
      name: "My Sparks",
      href: isValidUser ? "/sparks" : "/signin",
      icon: <AutoAwesome />,
      active: pathname === "/sparks",
      external: false,
    },
    {
      name: "Learn",
      href: "https://blog.promptify.com/",
      icon: <MenuBookRounded />,
      active: pathname === "/learn",
      external: true,
    },
  ];

  const expandSideBarOnHover = () => {
    setExpandedOnHover(true);
    setShowExpandIcon(true);
  };

  const collapseSidebarOnHover = () => {
    setExpandedOnHover(false);
    setShowExpandIcon(false);
  };

  return (
    <Box>
      <Drawer
        open={open || expandedOnHover}
        onMouseEnter={() => expandSideBarOnHover()}
        onMouseLeave={() => collapseSidebarOnHover()}
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
            boxSizing: "border-box",
            overflow: "hidden",
            bgcolor: "white",
            border: "none",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={1}
        >
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
                <Typography
                  sx={{ ml: "4px", fontSize: 10, opacity: open || expandedOnHover ? 1 : 0 }}
                  mt={1}
                  fontWeight={"bold"}
                >
                  beta
                </Typography>
              </Link>
            </Box>
            <IconButton
              onClick={toggleSideBar}
              sx={{
                opacity: showExpandIcon ? 1 : 0,
                border: "none",
                "&:hover": {
                  backgroundColor: "surface.2",
                },
              }}
            >
              {!open && expandedOnHover ? <SideBarCloseIcon /> : <SidebarIcon />}
            </IconButton>
          </Grid>
          {navItems.map(item => (
            <Grid key={item.name}>
              <ListItem
                disablePadding
                onClick={() => item.name == "Browse" && setShowFilters(!showFilters)}
              >
                <Link
                  href={item.href}
                  style={{
                    width: "100%",
                    textDecoration: "none",
                  }}
                  target={item.external ? "_blank" : ""}
                  onClick={e => {
                    if (item.name === "Browse" && isExplorePage) {
                      e.preventDefault();
                    }
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      borderRadius: "8px",
                      mx: 1,
                      padding: "16px 22px ",
                    }}
                    selected={item.active}
                  >
                    <Box
                      style={{
                        textDecoration: "none",

                        display: "flex",
                        width: open || expandedOnHover ? "100%" : "auto",
                        alignItems: "center",
                        justifyContent: open || expandedOnHover ? "initial" : "center",
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
                    </Box>
                    {item.name === "Browse" &&
                      isExplorePage &&
                      (showFilters ? (
                        <ExpandLess sx={{ mr: -1, color: "text.secondary" }} />
                      ) : (
                        <ExpandMore sx={{ mr: -1, color: "text.secondary" }} />
                      ))}
                  </ListItemButton>
                </Link>
              </ListItem>
              <Collapse
                in={showFilters && isExplorePage && item.name === "Browse"}
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
            isValidUser={isValidUser}
            sidebarOpen={open || expandedOnHover}
          />
        </Box>
      </Drawer>
    </Box>
  );
};
