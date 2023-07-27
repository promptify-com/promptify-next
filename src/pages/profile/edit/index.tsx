import React from "react";
import Head from "next/head";
import { useFormik } from "formik";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";

import { NameInfo } from "@/components/accountInfo/NameInfo";
import { About } from "@/components/accountInfo/About";
import { Gender } from "@/components/accountInfo/Gender";
import { ProfileImage } from "@/components/accountInfo/ProfileImage";
import { useGetCurrentUser, useUpdateUser } from "@/hooks/api/user";
import { IEditProfile } from "@/common/types";
import useSetUser from "@/hooks/useSetUser";
import { Header } from "@/components/Header";
import { useRouter } from "next/router";
import { Layout } from "@/layout";
import { ArrowBackIosRounded } from "@mui/icons-material";

const EditProfilePage = () => {
  const router = useRouter();
  const [user] = useGetCurrentUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateUser, _, isLoading] = useUpdateUser();
  const setUser = useSetUser();

  const onSubmit = async (values: IEditProfile) => {
    await updateUser(values).then((user) => setUser(user));
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
    <>
      <Head>
        <title>Edit Account</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Box padding={{ xs: "4px 0px", md: "0px 8px" }}>
          <Grid
            sx={{
              padding: { xs: "16px", md: "32px" },
            }}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                display={"flex"}
                flexDirection={"column"}
                gap={"16px"}
              >
                <Box
                  display="flex"
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  alignItems={"center"}
                  gap={2}
                  onClick={() => router.push("/profile")}
                  sx={{ cursor: "pointer" }}
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

                <NameInfo formik={formik} />
                <ProfileImage formik={formik} />
                <Gender formik={formik} />
                <About formik={formik} />

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt="1rem"
                >
                  <Button
                    sx={{
                      mb: "100px",
                      width: { xs: "90%", sm: "100%" },
                      bgcolor: "#D6D6D6",
                      height: "50px",
                      borderRadius: "15px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "common.black",
                    }}
                    onClick={formik.submitForm}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      <Typography>Save</Typography>
                    )}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={0} sm={3}></Grid>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
};
export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default EditProfilePage;
