import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Seo from "@/components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "surface.2",
          fontSize: "16px",
        }}
      >
        <Typography
          variant="h2"
          sx={{ textAlign: "center", fontSize: "inherit" }}
        >
          Ooops!! page could not be found. <br />
          <Link
            href="/"
            style={{ textDecoration: "none" }}
          >
            Go back Home
          </Link>
        </Typography>
      </Box>
    </>
  );
}
