import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import { SEO_DESCRIPTION } from "@/common/constants";
import { theme } from "@/theme";
import Head from "next/head";
import Button from "@mui/material/Button";
import BlogsCarousel from "@/components/Learn/BlogsCarousel";
import Grid from "@mui/material/Grid";
import TutorialCard from "@/components/Learn/TutorialCard";
import { FAQs, Tutorials } from "@/components/Learn/Constants";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMore from "@mui/icons-material/ExpandMore";

function ScrollContainer({ id }: { id: string }) {
  return (
    <Box
      id={id}
      sx={{
        position: "absolute",
        top: { xs: `-${theme.custom.headerHeight.xs}`, md: `-${theme.custom.headerHeight.md}` },
      }}
    />
  );
}

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
          p: { xs: "40px 20px", md: "40px 72px" },
          mt: { xs: theme.custom.headerHeight.xs, md: 0 },
          scrollBehavior: "smooth",
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
            p={{ xs: "24px 0", md: "24px 16px" }}
          >
            <ScrollContainer id="start" />
            <Stack gap={2}>
              <Typography
                fontSize={{ xs: 38, md: 48 }}
                fontWeight={400}
                color={"onSurface"}
              >
                Support & Knowledge Hub
              </Typography>
              <Typography
                fontSize={18}
                fontWeight={400}
              >
                Empowering Your Experience with onePanel
              </Typography>
            </Stack>
            <Button
              variant="contained"
              sx={{ p: "8px 16px", fontSize: 16, fontWeight: 500, borderRadius: "99px", lineHeight: "unset" }}
            >
              Get started guide
            </Button>
          </Stack>
          <Box position={"relative"}>
            <ScrollContainer id="blog" />
            <BlogsCarousel />
          </Box>
          <Stack
            gap={3}
            alignItems={"flex-start"}
            position={"relative"}
          >
            <ScrollContainer id="tutorials" />
            <Stack
              gap={2}
              p={{ md: "8px 16px" }}
            >
              <Typography
                fontSize={{ xs: 26, md: 32 }}
                fontWeight={400}
                color={"onSurface"}
              >
                Tutorials
              </Typography>
              <Typography
                fontSize={{ xs: 15, md: 18 }}
                fontWeight={400}
              >
                If you have a question that is not addressed here, please feel free to contact us for further
                assistance.
              </Typography>
            </Stack>
            <Grid
              container
              py={"8px"}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Grid
                  key={i}
                  item
                  xs={6}
                  md={3}
                  sx={{ p: { xs: "8px", md: "16px 16px 8px" } }}
                >
                  <TutorialCard tutorial={Tutorials[0]} />
                </Grid>
              ))}
            </Grid>
          </Stack>
          <Stack
            gap={3}
            sx={{
              width: { md: "70%" },
              m: "auto",
              position: "relative",
            }}
          >
            <ScrollContainer id="faq" />
            <Stack
              textAlign={"center"}
              gap={2}
              sx={{
                p: "8px 16px",
                width: { md: "70%" },
                m: "auto",
              }}
            >
              <Typography
                fontSize={{ xs: 26, md: 32 }}
                fontWeight={400}
                color={"onSurface"}
              >
                Frequently Asked Questions
              </Typography>
              <Typography
                fontSize={{ xs: 14, md: 16 }}
                fontWeight={400}
                color={"onSurface"}
              >
                If you have a question that is not addressed here, please feel free to contact us for further
                assistance.
              </Typography>
            </Stack>
            <Stack
              gap={2}
              px={{ md: "16px" }}
            >
              {FAQs.map(faq => (
                <Accordion
                  key={faq.question}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "surfaceContainerHighest",
                    borderRadius: "16px !important",
                    overflow: "hidden",
                    p: "4px 8px",
                    color: "onSurface",
                    m: "0 !important",
                    ".MuiAccordionSummary-root": {
                      minHeight: "48px !important",
                      fontSize: { xs: 15, md: 18 },
                      fontWeight: 400,
                      color: "onSurface",
                    },
                    ".MuiAccordionSummary-content": {
                      m: "0 !important",
                    },
                    ".MuiAccordionDetails-root": {
                      fontSize: { xs: 13, md: 16 },
                      fontWeight: 400,
                      color: "onSurface",
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>{faq.question}</AccordionSummary>
                  <AccordionDetails>{faq.answer}</AccordionDetails>
                </Accordion>
              ))}
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
      title: "Learn",
      description: SEO_DESCRIPTION,
    },
  };
}
