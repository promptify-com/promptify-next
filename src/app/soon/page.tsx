"use client";
import Link from "next/link";
// Mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// Components
// import { Layout } from "@/layout";
import Seo from "@/components/Seo";

export default function ComingSoon() {
  return (
    <>
      <Seo title="Coming Soon..." />
      {/* <Layout>  */}
      {/*  <Box   */}
      {/*    sx={{  */}
      {/*      display: "flex",   */}
      {/*      justifyContent: "center",  */}
      {/*      alignItems: "center",  */}
      {/*      minHeight: {   */}
      {/*        xs: theme => `calc(100svh - ${theme.custom.headerHeight.xs})`,   */}
      {/*        md: theme => `calc(100svh - ${theme.custom.headerHeight.md})`,   */}
      {/*      },   */}
      {/*      backgroundColor: "surface.2",  */}
      {/*      fontSize: "16px",  */}
      {/*    }}   */}
      {/*  >  */}
      <Typography
        variant="h2"
        sx={{ textAlign: "center", fontSize: "inherit" }}
      >
        Coming soon... <br />
        <Link
          href={"/"}
          style={{ textDecoration: "none" }}
        >
          Go back
        </Link>
      </Typography>
      {/*  </Box>   */}
      {/* </Layout> */}
    </>
  );
}
