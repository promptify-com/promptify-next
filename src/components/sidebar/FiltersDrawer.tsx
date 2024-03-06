import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MuiDrawer from "@mui/material/Drawer";
import { SidebarIcon } from "@/assets/icons/Sidebar";
import { SideBarCloseIcon } from "@/assets/icons/SideBarClose";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useRouter } from "next/router";
import { setStickyPromptsFilters } from "@/core/store/sidebarSlice";
import { theme } from "@/theme";
import lazy from "next/dynamic";
import Storage from "@/common/storage";
import { useEffect } from "react";

const PromptsFiltersLazy = lazy(() => import("./PromptsFilters"), {
  ssr: false,
});

interface Props {
  expandedOnHover: boolean;
}

const drawerWidth = 284;

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

function FiltersDrawer({ expandedOnHover }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = router.pathname;
  const isPromptsPage = pathname.split("/")[1] === "explore";
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const toggleSidebar = () => {
    if (isPromptsPage) {
      dispatch(setStickyPromptsFilters(!isPromptsFiltersSticky));
      if (!isPromptsFiltersSticky) {
        Storage.set("isPromptsFiltersSticky", String(!isPromptsFiltersSticky));
      } else {
        Storage.remove("isPromptsFiltersSticky");
      }
    }
  };

  useEffect(() => {
    const isPromptsFiltersSticky = Storage.get("isPromptsFiltersSticky");
    if (isPromptsFiltersSticky) {
      dispatch(setStickyPromptsFilters(isPromptsFiltersSticky === "true" ? true : false));
    }
  }, []);

  return (
    <Drawer
      variant={"permanent"}
      anchor="left"
      open={isPromptsPage && (isPromptsFiltersSticky || expandedOnHover)}
      sx={{
        zIndex: 1201,
        display: {
          xs: "none",
          md: isPromptsPage && (isPromptsFiltersSticky || expandedOnHover) ? "flex" : "none",
        },
        alignItems: "center",
        justifyContent: "center",
        "& .MuiDrawer-paper": {
          my: 0,
          padding: "10px 20px",
          borderRadius: 0,
          height: "100svh",
          boxShadow:
            !isPromptsFiltersSticky && expandedOnHover
              ? "0px 7px 8px -4px #00000033, 0px 12px 17px 2px #00000024, 0px 5px 22px 4px #0000001F"
              : "",
          boxSizing: "border-box",
          overflow: "auto",
          bgcolor: "surface.1",
          border: "none",
          width: `calc(${theme.custom.leftClosedSidebarWidth} + 285px)`,
          left: theme.custom.leftClosedSidebarWidth,
        },
      }}
    >
      {
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          height={"40px"}
          p={"20px 8px"}
          justifyContent={"space-between"}
        >
          <Typography
            sx={{
              color: "onSurface",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "100%",
            }}
          >
            {isPromptsPage ? "Prompts" : "Chats"}
          </Typography>
          <IconButton
            onClick={toggleSidebar}
            sx={{
              opacity: 1,
              border: "none",
              justifyContent: "flex-end",
              "&:hover": {
                backgroundColor: "surface.2",
              },
            }}
          >
            {!isPromptsFiltersSticky && expandedOnHover ? <SideBarCloseIcon /> : <SidebarIcon />}
          </IconButton>
        </Stack>
      }
      <Divider />
      {isPromptsPage && <PromptsFiltersLazy />}
    </Drawer>
  );
}

export default FiltersDrawer;
