import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MuiDrawer from "@mui/material/Drawer";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { theme } from "@/theme";
import { ReactNode } from "react";
import { KeyboardTab } from "@mui/icons-material";

const drawerWidth = 255;

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

interface Props {
  title: string;
  expanded: boolean;
  toggleExpand(): void;
  sticky: boolean;
  children?: ReactNode;
}

export default function DrawerContainer({ title, expanded, toggleExpand, sticky, children }: Props) {
  return (
    <Drawer
      variant={"permanent"}
      anchor="left"
      open={expanded}
      sx={{
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: expanded ? "flex" : "none",
        "& .MuiDrawer-paper": {
          my: 0,
          padding: "10px 20px",
          borderRadius: 0,
          height: "100svh",
          boxSizing: "border-box",
          bgcolor: "surfaceContainerLow",
          border: "none",
          width: `calc(${theme.custom.leftClosedSidebarWidth} + ${drawerWidth}px)`,
          left: theme.custom.leftClosedSidebarWidth,
          overflow: "auto",
          overscrollBehavior: "contain",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }}
    >
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        height={"40px"}
        p={"15px 8px"}
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
          {title}
        </Typography>
        <IconButton
          onClick={toggleExpand}
          sx={{
            opacity: 1,
            border: "none",
            justifyContent: "flex-end",
            svg: {
              color: "onSurface",
              transform: sticky ? "rotateY(180deg)" : "none",
            },
            "&:hover": {
              backgroundColor: "surface.2",
            },
          }}
        >
          <KeyboardTab />
        </IconButton>
      </Stack>
      <Divider />
      {children}
    </Drawer>
  );
}
