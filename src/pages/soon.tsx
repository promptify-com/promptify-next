import { Layout } from "@/layout";
import { theme } from "@/theme";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import Seo from "@/components/Seo";

interface Props {
  backTo?: string;
}

export default function ComingSoon({ backTo }: Props) {
  return (
    <>
      <Seo title="Coming Soon..." />
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: {
              xs: `calc(100svh - ${theme.custom.headerHeight.xs})`,
              md: `calc(100svh - ${theme.custom.headerHeight.md})`,
            },
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
      </Layout>
    </>
  );
}
