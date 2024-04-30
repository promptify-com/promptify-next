import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import { SEO_DESCRIPTION } from "@/common/constants";
import { theme } from "@/theme";
import Head from "next/head";
import Button from "@mui/material/Button";
import BlogsCarousel from "../../components/Learn/BlogsCarousel";
import Grid from "@mui/material/Grid";
import TutorialCard from "@/components/Learn/TutorialCard";
import { Tutorials } from "@/components/Learn/Constants";

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
            m: "auto",
          }}
        >
          <Stack
            gap={3}
            alignItems={"flex-start"}
            p={"24px 16px"}
          >
            <Stack gap={2}>
              <Typography
                fontSize={48}
                fontWeight={400}
                color={"onSurface"}
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
          <Stack gap={3}>
            <Stack
              gap={3}
              alignItems={"flex-start"}
            >
              <Stack
                gap={2}
                p={"8px 16px"}
              >
                <Typography
                  fontSize={32}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  Tutorials
                </Typography>
                <Typography
                  fontSize={18}
                  fontWeight={400}
                >
                  If you have a question that is not addressed here, please feel free to contact us for further
                  assistance.
                </Typography>
              </Stack>
              <Grid container>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Grid
                    key={i}
                    item
                    xs={3}
                    sx={{ p: "16px 16px 8px", ":last-of-type": { pl: 0 } }}
                  >
                    <TutorialCard tutorial={Tutorials[0]} />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Stack>
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
