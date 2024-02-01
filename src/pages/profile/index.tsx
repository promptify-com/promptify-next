import { Box, Grid, Typography } from "@mui/material";
import { Connections, Home, Identy, TemplatesManager } from "@/components/profile";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import EditProfile from "@/components/profile/EditProfile";
import Credentials from "@/components/profile/Credentials";
import { SEO_DESCRIPTION } from "@/common/constants";

const Profile = () => {
  const isEditMode = useSelector((state: RootState) => state.profile.showEditMode);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <Protected>
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
                  <Credentials />
                  <Identy />
                  <TemplatesManager
                    type={"user"}
                    title="My templates"
                    id="my-templates"
                  />
                  {currentUser?.is_admin && (
                    <TemplatesManager
                      type={"admin"}
                      title="All templates"
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Box>
        </Layout>
      )}
    </Protected>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "Your Profile",
      description: SEO_DESCRIPTION,
    },
  };
}

export default Profile;
