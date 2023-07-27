import { ReactNode } from "react";
import { Box, Grid } from "@mui/material";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./core/store";
import { setOpenSidebar } from "./core/store/sidebarSlice";

export const Layout = ({ children }: { children: ReactNode }) => {
  const open = useSelector((state: RootState) => state.sidebar.open);
  const dispatch = useDispatch();
  const toggleSidebar = () => {
    dispatch(setOpenSidebar(!open));
  };
  return (
    <>
      <Box sx={{ bgcolor: "surface.3" }}>
        <Sidebar open={open} toggleSideBar={() => toggleSidebar()} />
        <Box
          sx={{
            minHeight: "100vh",
            maxWidth: {
              xs: "100%",
              md: open ? "calc(100% - 299px)" : "80%",
            },
            m: { md: open ? "0px 0px 0px auto" : "0px auto 0px auto" },
          }}
        >
          <Header transparent />
          <Box
            bgcolor={{ xs: "surface.1", md: "surface.3" }}
            minHeight={{ xs: "calc(100svh - 60px)", md: "calc(100vh - 90px)" }}
          >
            <Grid display={"flex"} flexDirection={"column"} gap={"16px"}>
              {children}
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
};

