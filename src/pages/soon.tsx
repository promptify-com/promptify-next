import { Layout } from "@/layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Seo from "@/components/Seo";
import { useTheme } from "@mui/material/styles";

interface Props {
  backTo?: string;
}

export default function ComingSoon({ backTo }: Props) {
  const theme = useTheme();

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
              href={backTo ?? "/"}
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
