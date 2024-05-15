import { useState } from "react";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import AccountSidebar from "@/components/profile2/AccountSidebar";
import IconButton from "@mui/material/IconButton";
import ProfileNavigation from "./ProfileNavigation";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { isDesktopViewPort } from "@/common/helpers";

export default function Layout({ children, title }: { children: React.ReactNode; title: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const desktopView = isDesktopViewPort();

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };
  return desktopView ? (
    <>{children}</>
  ) : (
    <Box
      pt={3}
      sx={{
        bgcolor: "surfaceContainerLow",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          gap: "16px",
          alignSelf: "stretch",
          flexWrap: "wrap",
          mt: 8,
          ml: 1,
        }}
      >
        <IconButton
          sx={{
            display: "flex",
            padding: "8px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
          }}
          onClick={() => toggleDrawer(true)}
        >
          <MenuRoundedIcon sx={{ fontSize: "24px", color: "#1C1B1F" }} />
        </IconButton>

        <Typography
          sx={{
            color: "var(--secondary, var(--secondary, #575E71))",
            fontFeatureSettings: "'clig' off, 'liga' off",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "100%",
          }}
        >
          {title}
        </Typography>
      </Box>

      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onOpen={() => toggleDrawer(true)}
        onClose={() => toggleDrawer(false)}
        variant="temporary"
        sx={{
          width: "301px",
        }}
      >
        <AccountSidebar closeSidebar={() => toggleDrawer(false)} />
      </SwipeableDrawer>
      <Box component="main">{children}</Box>

      <ProfileNavigation />
    </Box>
  );
}
