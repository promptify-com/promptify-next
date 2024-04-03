import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Seo from "@/components/Seo";

export default function InternalError() {
  return (
    <>
      <Seo title="Ooops!!" />
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
          Ooops!! something did not go as expected. <br />
          <Link
            href="/"
            style={{ textDecoration: "none" }}
          >
            Go back Home!
          </Link>
        </Typography>
      </Box>
    </>
  );
}
