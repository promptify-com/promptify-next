import { type ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Header from "@/components/Header";
import { theme } from "@/theme";
import Sidebar from "./components/sidebar/Sidebar";
import { usePathname } from "next/navigation";
import { isDesktopViewPort } from "./common/helpers";
import CollectionsDesktop from "./components/common/sidebar/CollectionsDesktop";

export const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isPromptsPage = pathname.split("/")[1] === "explore";
  const desktopView = isDesktopViewPort();
  const [openFavoritesSidebar, setOpenFavoritesSidebar] = useState(false);
  const favoritesListWidth = openFavoritesSidebar ? theme.custom.favoritesListWidth : "0px";

  return (
    <Box sx={{ bgcolor: "surface.3", ...(openFavoritesSidebar && { display: "flex", flexDirection: "row" }) }}>
      <Sidebar />
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={"2px"}
        sx={{
          minHeight: "100svh",
          maxWidth: {
            xs: "100%",
            md: isPromptsPage
              ? `calc(100% - ${theme.custom.defaultSidebarWidth} - ${favoritesListWidth})`
              : `calc(100% - ${theme.custom.leftClosedSidebarWidth} - ${favoritesListWidth})`,
          },
          m: { md: `0px 0px 0px auto` },
        }}
      >
        <Header
          transparent
          onFavoritesListClick={() => setOpenFavoritesSidebar(true)}
        />
        <Box
          bgcolor={"surface.1"}
          minHeight={{
            xs: `calc(100svh - ${theme.custom.headerHeight.xs})`,
            md: `calc(100svh - ${theme.custom.headerHeight.md})`,
          }}
          sx={{
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Grid
            display={"flex"}
            flexDirection={"column"}
            gap={"16px"}
          >
            {children}
          </Grid>
        </Box>
      </Box>
      {desktopView && openFavoritesSidebar && <CollectionsDesktop onClose={() => setOpenFavoritesSidebar(false)} />}
    </Box>
  );
};
