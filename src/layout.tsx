import { ReactNode } from "react";
import { Box, Grid } from "@mui/material";

import { Header } from "@/components/Header";
import { DefaultSidebar } from "@/components/SideBar";
import { theme } from "@/theme";
import { useAppSelector } from "./hooks/useStore";

export const Layout = ({ children }: { children: ReactNode }) => {
  const defaultSidebarOpen = useAppSelector(state => state.sidebar.defaultSidebarOpen);

  return (
    <>
      <Box sx={{ bgcolor: "surface.3" }}>
        <DefaultSidebar />
        <Box
          sx={{
            minHeight: "100svh",
            maxWidth: {
              xs: "100%",
              md: defaultSidebarOpen ? `calc(100% - ${theme.custom.defaultSidebarWidth})` : "80%",
            },
            m: { md: defaultSidebarOpen ? "0px 0px 0px auto" : "0px auto 0px auto" },
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
