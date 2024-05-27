import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import { SEO_DESCRIPTION } from "@/common/constants";
import { theme } from "@/theme";

export default function TermsOfUsePage() {
  return (
    <Layout footer>
      <Box
        sx={{
          p: { xs: "40px 20px", md: "40px 72px" },
          mt: { xs: theme.custom.headerHeight.xs, md: 0 },
        }}
      >
        <Stack
          gap={3}
          alignItems={"flex-start"}
          sx={{
            maxWidth: "1184px",
            m: "auto",
            p: "24px 16px",
            fontSize: 16,
            fontWeight: 400,
            color: "onSurface",
            "& p": { m: 0, lineHeight: "160%" },
            a: {
              color: "inherit",
              ":hover": {
                textDecoration: "none",
              },
            },
          }}
        >
          <Typography
            fontSize={{ xs: 38, md: 48 }}
            fontWeight={400}
            color={"onSurface"}
          >
            Terms of Use
          </Typography>
          <Box component={"p"}>Thanks for using Promptify!</Box>
          <Box component={"p"}>
            These Terms of Use apply when you utilize our services hosted on{" "}
            <a
              href="https://promptify.com"
              target="_blank"
              style={{ color: "blue" }}
            >
              Promptify.com
            </a>
            , which include our APIs, software, tools, data, documentation, and websites (“Services”). You agree to
            these terms by using our Services. Our Privacy Policy details how we handle your personal information.
          </Box>
          <Typography
            fontSize={{ xs: 26, md: 32 }}
            fontWeight={400}
            color={"onSurface"}
          >
            1. Access
          </Typography>
          <Box component={"p"}>
            You must be at least 13 to use our Services. Those under 18 need parental or guardian permission. You must
            have the authority to accept these terms on behalf of another person or entity if you are using the Services
            for them. When registering, provide accurate information. Do not share your access credentials or account
            outside your organization. You are responsible for activities under your account.
          </Box>
          <Typography
            fontSize={{ xs: 26, md: 32 }}
            fontWeight={400}
            color={"onSurface"}
          >
            2. Usage
          </Typography>
          <Box component={"p"}>
            (a) Services. You may use the Services in line with these Terms and all laws. We, along with our affiliates,
            own the Services.
            <br />
            <br />
            (b) Feedback. We may use any feedback, comments, ideas, proposals, and suggestions you provide without any
            restriction or compensation to you.
            <br />
            <br />
            (c) Restrictions. You may not infringe upon rights, reverse engineer, compete with us using output from our
            Services, scrape data, misrepresent output, or trade API keys without our consent. Don&apos;t send us any
            personal info of children under 13. Use Services only in supported geographies.
            <br />
            <br />
            (d) Third Parties. We aren&apos;t responsible for third-party products used in connection with our Services.
          </Box>
          <Typography
            fontSize={{ xs: 26, md: 32 }}
            fontWeight={400}
            color={"onSurface"}
          >
            3. Content
          </Typography>
          <Box component={"p"}>
            (a) Your Content. You own all input you provide to the Services. We assign all output generated to you,
            allowing you to use it for any purpose including commercial ones. You&apos;re responsible for ensuring your
            content doesn&apos;t violate laws or these Terms.
            <br />
            <br />
            (b) Similarity of Content. The output may not be unique and can be similar for other users.
            <br />
            <br />
            (c) Use of Content. We don&apos;t use API Content to improve our Services. Non-API Content might be used to
            enhance our Services.
            <br />
            <br />
            (d) Accuracy. Due to the nature of AI and machine learning, the output may sometimes be inaccurate.
          </Box>
        </Stack>
      </Box>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Terms of Use",
      description: SEO_DESCRIPTION,
    },
  };
}
