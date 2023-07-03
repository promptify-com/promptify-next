import React from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { NameInfo } from "@/components/accountInfo/NameInfo";
import { About } from "@/components/accountInfo/About";
import { Gender } from "@/components/accountInfo/Gender";
import { ProfileImage } from "@/components/accountInfo/ProfileImage";

import useUser from "@/hooks/useUser";
import { useFormik } from "formik";
import { useGetCurrentUser, useUpdateUser } from "@/hooks/api/user";
import { IEditProfile } from "@/common/types";
import useSetUser from "@/hooks/useSetUser";
import { PageWrapper } from "@/components/PageWrapper";
import { Header } from "@/components/blocks/Header";
import { useRouter } from "next/router";
import Head from "next/head";

const AccountInfo = () => {
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
        <title>Promptify | Boost Your Creativity</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper>
        <Header fixed />
        <Grid container>
          <Grid item xs={0} sm={3}></Grid>
          <Grid item xs={12} sm={6}>
            <Box
              display="flex"
              mt="140px"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              onClick={() => router.push("/dashboard")}
              sx={{ cursor: "pointer" }}
            >
              <Typography
                fontWeight={500}
                fontSize={{ xs: "1.5rem", sm: "2rem" }}
                textAlign={{ xs: "center", sm: "start" }}
                color="#0000007A"
              >
                User Hub &gt;
              </Typography>
              <Typography
                fontWeight={500}
                fontSize={{ xs: "1.5rem", sm: "2rem" }}
                textAlign={{ xs: "center", sm: "start" }}
              >
                &nbsp;Account Info
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
      </PageWrapper>
    </>
  );
};
export default AccountInfo;
