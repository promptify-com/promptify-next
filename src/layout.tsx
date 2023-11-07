import { ReactNode } from "react";
import { Box, Grid } from "@mui/material";

import { Header } from "@/components/Header";
import { DefaultSidebar } from "@/components/SideBar";
import { theme } from "@/theme";
import { useAppSelector } from "./hooks/useStore";

export const Layout = ({ fullWidth = false, children }: { fullWidth?: boolean; children: ReactNode }) => {
  const defaultSidebarOpen = useAppSelector(state => state.sidebar.defaultSidebarOpen);

  return (
    <>
      <Box sx={{ bgcolor: "surface.1" }}>
        <DefaultSidebar />
        <Box
          sx={{
            minHeight: "100svh",
            maxWidth: {
              xs: "100%",
              md: defaultSidebarOpen
                ? `calc(100% - ${theme.custom.defaultSidebarWidth})`
                : fullWidth
                ? `calc(100% - 86px)`
                : "80%",
            },
            m: { md: defaultSidebarOpen || fullWidth ? "0 0 0 auto" : "0 auto 0 auto" },
          }}
        >
          <Header transparent />
          <Box
            bgcolor={{ xs: "surface.1", md: "surface.3" }}
            minHeight={{
              xs: `calc(100svh - ${theme.custom.headerHeight.xs})`,
              md: `calc(100svh - ${theme.custom.headerHeight.md})`,
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
      </Box>
    </>
  );
};
