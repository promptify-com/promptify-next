import { ReactNode } from "react";
import { Box, Grid } from "@mui/material";

import { Header } from "@/components/blocks/VHeader";
import { Sidebar } from "@/components/blocks/VHeader/Sidebar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Box sx={{ bgcolor: "surface.3" }}>
        <Grid display={"flex"}>
          <Sidebar />
        </Grid>
        <Box
          sx={{
            mt: "60px",
            minHeight: "100vh",
            width: { xs: "100%", md: "calc(100% - 299px)" },
            ml: { md: "auto" },
          }}
        >
          <Header fixed />
          {children}
        </Box>
      </Box>
    </>
  );
};
