import { ReactNode, useState } from "react";
import { Box, Grid } from "@mui/material";

import { Header } from "@/components/blocks/VHeader";
import { Sidebar } from "@/components/blocks/VHeader/Sidebar";

export const Layout = ({ children }: { children: ReactNode }) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);
  return (
    <>
      <Box sx={{ bgcolor: "surface.3" }}>
        <Grid display={"flex"}>
          <Sidebar
            open={openSideBar}
            toggleSideBar={() => setOpenSideBar(!openSideBar)}
          />
        </Grid>
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
                padding: { xs: "8px 0 0 8px", sm: "32px" },
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
