import { Box, Grid, Typography } from "@mui/material";
import Head from "next/head";

import { Connections, Home, Identy, Prompts } from "@/components/dashboard";
import { Layout } from "@/layout";

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Promptify | Boost Your Creativity</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Box mt={{ xs: 7, md: 0 }} padding={{ xs: "4px 0px", md: "0px 8px" }}>
          <Grid
            sx={{
              padding: { xs: "16px 4px", md: "32px" },
            }}
          >
            <Box sx={{ px: "12px" }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems={"flex-start"}
                gap={"36px"}
                width={"100%"}
              >
                <Box
                  display={"flex"}
                  justifyContent={{ xs: "center", md: "start" }}
                  textAlign={{ xs: "center", sm: "start" }}
                >
                  <Typography
                    fontWeight={500}
                    fontSize={{ xs: "1.5rem", sm: "2rem" }}
                    sx={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: 500,
                      fontSize: { xs: "24px", sm: "34px" },
                      lineHeight: { xs: "27px", sm: "123.5%" },
                      color: "onSurface",
                    }}
                  >
                    Welcome to your space
                  </Typography>
                </Box>
                <Home />
                <Connections />
                <Identy />
                <Prompts />
              </Box>
            </Box>
          </Grid>
        </Box>
      </Layout>
    </>
  );
};
export async function getServerSideProps() {
  return {
    props: {
      title: "User Profile",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default Dashboard;
