import React from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { ArrowBackIosRounded } from "@mui/icons-material";

import { NameInfo } from "@/components/accountInfo/NameInfo";
import { About } from "@/components/accountInfo/About";
import { Gender } from "@/components/accountInfo/Gender";
import { ProfileImage } from "@/components/accountInfo/ProfileImage";
import { useGetCurrentUser, useUpdateUser } from "@/hooks/api/user";
import { IEditProfile } from "@/common/types";
import useSetUser from "@/hooks/useSetUser";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";

const EditProfilePage = () => {
  const router = useRouter();
  const [user] = useGetCurrentUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateUser, _, isLoading] = useUpdateUser();
  const setUser = useSetUser();
  const onSubmit = async (values: IEditProfile) => {
    await updateUser(values).then((user) => setUser(user));
    router.reload();
  };

  const formik = useFormik<IEditProfile>({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      username: user?.username || "",
      gender: user?.gender || "",
      bio: user?.bio || "",
      avatar: null, // file expected
    },
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <Protected>
      <Layout>
        <Box mt={{ xs: 7, md: 0 }} padding={{ xs: "4px 0px", md: "0px 8px" }}>
          <Grid
            sx={{
              padding: { xs: "16px", md: "32px" },
            }}
          >
            <Grid display={"flex"} flexDirection={"column"} gap={"16px"}>
              <Box
                display="flex"
                justifyContent={{ xs: "center", sm: "flex-start" }}
                alignItems={"center"}
                gap={2}
                onClick={() => router.push("/profile")}
                sx={{ cursor: "pointer", width: "fit-content" }} // Adding width with fit-content will make box take only the width needed
              >
                <ArrowBackIosRounded
                  sx={{
                    fontSize: { xs: "16px", md: "20px" },
                  }}
                />
                <Typography
                  fontWeight={500}
                  fontSize={{ xs: "1.5rem", md: "2rem" }}
                  textAlign={{ xs: "center", md: "start" }}
                >
                  Edit Profile
                </Typography>
              </Box>
              <Box sx={{ px: { xs: 0, md: "12px" } }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems={"flex-start"}
                  gap={"36px"}
                  width={"100%"}
                >
                  <NameInfo formik={formik} />
                  <ProfileImage formik={formik} user={user} />
                  <Gender formik={formik} />
                  <About formik={formik} />
                </Box>
              </Box>

              <Box>
                <Button
                  sx={{
                    bgcolor: "var(--primary-main, #3B4050)",
                    padding: "8px 22px",
                    minWidth: "96px",
                    borderRadius: "15px",
                  }}
                  onClick={formik.submitForm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={23} />
                  ) : (
                    <Typography color={"surface.1"}>Save profile</Typography>
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </Protected>
  );
};
export async function getServerSideProps() {
  return {
    props: {
      title: "",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default EditProfilePage;
