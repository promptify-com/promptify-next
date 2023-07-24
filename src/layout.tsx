import { ReactNode, useState } from "react";
import { Box, Grid } from "@mui/material";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/SideBar";

export const Layout = ({ children }: { children: ReactNode }) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);
  return (
    <>
      <Box sx={{ bgcolor: "surface.3" }}>
        <Sidebar
          open={openSideBar}
          toggleSideBar={() => setOpenSideBar(!openSideBar)}
        />
        <Box
          sx={{
            minHeight: "100vh",
            maxWidth: {
              xs: "100%",
              md: openSideBar ? "calc(100% - 299px)" : "80%",
            },
            m: openSideBar ? "0px 0px 0px auto" : "0px auto 0px auto",
          }}
        >
          <Header transparent />
          <Box padding={"0px 8px"}>
            <Grid
              sx={{
                padding: { xs: "8px 0 0 8px", sm: "0px 32px" },
              }}
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
