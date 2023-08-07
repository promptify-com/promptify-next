import { Box, Grid, Typography } from "@mui/material";
import Head from "next/head";

import { Connections, Home, Identy, AllTemplates } from "@/components/profile";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { MyTemplates } from "@/components/profile/MyTemplates";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import EditProfile from "@/components/profile/EditProfile";
import { useGetCurrentUser } from "@/hooks/api/user";

const Dashboard = () => {
  const isEditMode = useSelector(
    (state: RootState) => state.profile.showEditMode
  );
  const [user] = useGetCurrentUser();
  return (
    <Protected>
      <Head>
        <title>Promptify | Boost Your Creativity</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {isEditMode ? (
          <EditProfile />
        ) : (
          <Layout>
            <Box
              mt={{ xs: 7, md: 0 }}
              padding={{ xs: "4px 0px", md: "0px 8px" }}
            >
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
                    <MyTemplates />
                    {user?.is_admin && <AllTemplates />}
                  </Box>
                </Box>
              </Grid>
            </Box>
          </Layout>
        )}
      </>
    </Protected>
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
