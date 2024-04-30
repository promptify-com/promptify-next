import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import { SEO_DESCRIPTION } from "@/common/constants";
import { theme } from "@/theme";
import Head from "next/head";
import Button from "@mui/material/Button";
import BlogsCarousel from "../../components/Learn/BlogsCarousel";

export default function LearnPage() {
  return (
    <Layout footer>
      <Head>
        <link
          rel="preconnect"
          href="https://uploads-ssl.webflow.com"
        />
      </Head>
      <Box
        sx={{
          p: "40px 72px",
          mt: { xs: theme.custom.headerHeight.xs, md: 0 },
        }}
      >
        <Stack
          gap={9}
          sx={{
            maxWidth: "1184px",
            // width: { xs: "100%", md: "80%" },
            m: "auto",
          }}
        >
          <Stack
            gap={3}
            alignItems={"flex-start"}
          >
            <Stack gap={2}>
              <Typography
                fontSize={48}
                fontWeight={400}
              >
                Support & Knowledge Hub
              </Typography>
              <Typography
                fontSize={18}
                fontWeight={400}
              >
                Empowering Your Experience with Promptify
              </Typography>
            </Stack>
            <Button
              variant="contained"
              sx={{ p: "8px 16px", fontSize: 16, fontWeight: 500, borderRadius: "99px", lineHeight: "unset" }}
            >
              Get started guide
            </Button>
          </Stack>
          <BlogsCarousel />
        </Stack>
      </Box>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Privacy Policy",
      description: SEO_DESCRIPTION,
    },
  };
}
