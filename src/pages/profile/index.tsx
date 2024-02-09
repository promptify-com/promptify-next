import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { Connections, Home, Identity, TemplatesManager } from "@/components/profile";
import { useAppSelector } from "@/hooks/useStore";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import EditProfile from "@/components/profile/EditProfile";
import Credentials from "@/components/profile/Credentials";
import { SEO_DESCRIPTION } from "@/common/constants";

const Profile = () => {
  const isEditMode = useAppSelector(state => state.profile.showEditMode);
  const currentUser = useAppSelector(state => state.user.currentUser);

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
                  <Identity />
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
