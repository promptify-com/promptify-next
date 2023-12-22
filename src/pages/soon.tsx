import { Box, Typography } from "@mui/material";
import Link from "next/link";

interface Props {
  backTo?: string;
}

export default function ComingSoon({ backTo }: Props) {
  return (
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
        Coming soon... <br />
        <Link
          href={backTo || "/"}
          style={{ textDecoration: "none" }}
        >
          Go back
        </Link>
      </Typography>
    </Box>
  );
}
