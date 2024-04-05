import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useTheme, type SxProps } from "@mui/material/styles";
import type { ReactNode } from "react";
import KeyboardTab from "@mui/icons-material/KeyboardTab";
import ClearRounded from "@mui/icons-material/ClearRounded";
import useBrowser from "@/hooks/useBrowser";

const drawerWidth = 255;

interface Props {
  title: string;
  expanded: boolean;
  toggleExpand: () => void;
  onClose?: () => void;
  sticky: boolean;
  children?: ReactNode;
  style?: SxProps;
}

export default function DrawerContainer({
  title,
  expanded,
  toggleExpand,
  sticky,
  children,
  style = {},
  onClose,
}: Props) {
  const theme = useTheme();
  const { isMobile } = useBrowser();

  return (
    <SwipeableDrawer
      anchor="left"
      variant={isMobile ? "temporary" : "permanent"}
      {...(isMobile && { disablePortal: true })}
      open={expanded}
      onClose={() => {}}
      onOpen={() => {}}
      sx={{
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: expanded ? "flex" : "none",
        "& .MuiDrawer-paper": {
          height: { xs: `calc(100svh - ${theme.custom.headerHeight.xs} + 16px)`, md: "100svh" },
          width: { xs: "85svw", md: `calc(${theme.custom.leftClosedSidebarWidth} + ${drawerWidth}px)` },
          left: { xs: 0, md: theme.custom.leftClosedSidebarWidth },
          mt: { xs: `calc(${theme.custom.headerHeight.xs} - 10px)`, md: 0 },
          my: 0,
          padding: "10px 20px",
          borderRadius: 0,
          boxSizing: "border-box",
          bgcolor: "surfaceContainerLow",
          border: "none",
          overflow: "auto",
          overscrollBehavior: "contain",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ...style,
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
          onClick={isMobile ? onClose : toggleExpand}
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
          {isMobile ? <ClearRounded /> : <KeyboardTab />}
        </IconButton>
      </Stack>
      <Divider />
      {children}
    </SwipeableDrawer>
  );
}
