import React from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { ArrowBackIosRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "@/layout";
import { IEditProfile } from "@/common/types";
import { useUpdateUserProfileMutation } from "@/core/api/user";
import { NameInfo } from "@/components/accountInfo/NameInfo";
import { About } from "@/components/accountInfo/About";
import { Gender } from "@/components/accountInfo/Gender";
import { ProfileImage } from "@/components/accountInfo/ProfileImage";
import useToken from "@/hooks/useToken";
import useLogout from "@/hooks/useLogout";
import { RootState } from "@/core/store";
import { updateUser } from "@/core/store/userSlice";

export const EditProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const savedToken = useToken();
  const logoutUser = useLogout();
  const onSubmit = async (values: IEditProfile) => {
    if (!savedToken || !currentUser?.id) {
      logoutUser();
      return;
    }

    const payload = await updateUserProfile({ token: savedToken, data: values }).unwrap();
    dispatch(updateUser(payload));

    router.reload();
  };

  const formik = useFormik<IEditProfile>({
    initialValues: {
      first_name: currentUser?.first_name || "",
      last_name: currentUser?.last_name || "",
      username: currentUser?.username || "",
      gender: currentUser?.gender || "",
      bio: currentUser?.bio || "",
      avatar: null, // file expected
    },
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: 0 }}
        padding={{ xs: "4px 0px", md: "0px 8px" }}
      >
        <Grid
          sx={{
            padding: { xs: "16px", md: "32px" },
          }}
        >
          <Grid
            display={"flex"}
            flexDirection={"column"}
            gap={"16px"}
          >
            <Box
              display="flex"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              alignItems={"center"}
              gap={2}
              onClick={() => {}}
              sx={{ cursor: "pointer", width: "fit-content" }}
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
                <ProfileImage
                  user={currentUser}
                  token={savedToken}
                />
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
                {isLoading ? <CircularProgress size={23} /> : <Typography color={"surface.1"}>Save profile</Typography>}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default EditProfile;
