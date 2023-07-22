import { Box, Grid } from "@mui/material";

import Head from "next/head";

import { PageLoading } from "@/components/PageLoading";
import { Connections, Home, Identy, Prompts } from "@/components/dashboard";
import { Layout } from "@/layout";
import useToken from "@/hooks/useToken";

const Dashboard = () => {
  const token = useToken();

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
        {token ? (
          <Box sx={{ px: "12px" }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={"flex-start"}
              gap={"16px"}
              width={"100%"}
            >
              <Home />
              <Connections />
              <Identy />
              <Prompts />
            </Box>
          </Box>
        ) : (
          <PageLoading />
        )}
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
