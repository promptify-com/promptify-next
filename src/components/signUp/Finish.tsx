import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FinishCard from "./FinishCard";

import { useUpdateUserProfileMutation } from "@/core/api/user";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useFormik } from "formik";
import type { IEditProfile } from "@/common/types";
import { updateUser } from "@/core/store/userSlice";
import useToken from "@/hooks/useToken";
import useLogout from "@/hooks/useLogout";
import ProfileImageSignUp from "./ProfileImageSignUp";
import CircularProgress from "@mui/material/CircularProgress";

const Finish = () => {
  const router = useRouter();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const dispatch = useAppDispatch();
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

    router.push("/profile");
  };

  const formik = useFormik<IEditProfile>({
    initialValues: {
      first_name: currentUser?.first_name || "",
      last_name: currentUser?.last_name || "",
      username: currentUser?.username || "",
      avatar: null,
    },
    enableReinitialize: true,
    onSubmit,
  });

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "48px",
          flex: "1 0 0",
          height: "822px",
          width: "952px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "560px",
            padding: "var(--none, 0px) var(--2, 16px)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--3, 24px)",
          }}
        >
          <Typography
            sx={{
              color: "var(--onSurface, var(--onSurface, #1B1B1F))",
              textAlign: "center",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "32px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "110%",
              letterSpacing: "0.17px",
            }}
          >
            Good job!
          </Typography>

          <Typography
            sx={{
              color: "var(--onSurface, var(--onSurface, #1B1B1F))",
              textAlign: "center",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "160%",
              letterSpacing: "0.17px",
            }}
          >
            Please, set up your profile to finish
          </Typography>
        </Box>

        <ProfileImageSignUp
          user={currentUser}
          token={savedToken}
        />

        <FinishCard title="Basic information:">
          <List
            sx={{
              py: 0,
              width: "574px",
              borderRadius: "24px",
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <ListItem sx={listItemStyle.listItem}>
              <Box sx={listItemStyle.wrapper}>
                <Typography sx={listItemStyle.listLabelStyle}>First name</Typography>
                <TextField
                  id="outlined-required"
                  variant="standard"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  helperText={formik.touched.first_name && formik.errors.first_name}
                  error={!!formik.touched.first_name && Boolean(formik.errors.first_name)}
                  sx={listItemStyle.listInputStyle}
                />
              </Box>
            </ListItem>
            <Divider component="li" />
            <ListItem sx={listItemStyle.listItem}>
              <Box sx={listItemStyle.wrapper}>
                <Typography sx={listItemStyle.listLabelStyle}>Last name</Typography>
                <TextField
                  id="outlined-required"
                  variant="standard"
                  name="last_name"
                  onChange={formik.handleChange}
                  value={formik.values.last_name}
                  helperText={formik.touched.last_name && formik.errors.last_name}
                  error={!!formik.touched.last_name && Boolean(formik.errors.last_name)}
                  sx={listItemStyle.listInputStyle}
                />
              </Box>
            </ListItem>
            <Divider component="li" />
            <ListItem sx={listItemStyle.listItem}>
              <Box sx={listItemStyle.wrapper}>
                <Typography sx={listItemStyle.listLabelStyle}>Nickname</Typography>
                <TextField
                  id="outlined-required"
                  variant="standard"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  helperText={formik.touched.username && formik.errors.username}
                  error={!!formik.touched.username && Boolean(formik.errors.username)}
                  sx={listItemStyle.listInputStyle}
                />
              </Box>
            </ListItem>
          </List>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "48px",
              justifyContent: "center",
              alignItems: "center",
              padding: "var(--1, 8px) var(--3, 24px)",
              mt: "48px",
            }}
          >
            <Button
              sx={{
                display: "flex",
                width: "100%",
                height: "48px",
                padding: "12px 16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "99px",
                background: "var(--onSurface, #1B1B1F)",
                "&:hover": {
                  background: "var(--onSurface, #1B1B1F)",
                },
              }}
              onClick={formik.submitForm}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={23} />
              ) : (
                <Typography
                  sx={{
                    color: "var(--onPrimary, var(--onPrimary, #FFF))",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "150%",
                  }}
                >
                  Finish
                </Typography>
              )}
            </Button>
          </Box>
        </FinishCard>
      </Box>
    </Box>
  );
};

const listItemStyle = {
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "var(--2, 16px)",
    padding: "var(--2, 16px) var(--1, 8px) var(--2, 16px) var(--3, 24px)",
  },
  listLabelStyle: {
    color: "var(--secondary, var(--secondary, #575E71))",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "140%",
    letterSpacing: "0.17px",
    width: "220px",
  },
  listInputStyle: {
    "& .MuiInputBase-input": {
      color: "var(--onSurface, #1B1B1F)",
      fontFeatureSettings: "'clig' off, 'liga' off",
      fontFamily: "Poppins",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "160%",
      letterSpacing: "0.17px",
      border: "none",
      "&:hover:not(.Mui-disabled):before": {
        borderBottom: "none",
      },
      "&:before": {
        borderBottom: "none",
      },
      "&:after": {
        borderBottom: "none",
      },
    },
    "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
    },
  },
};

export default Finish;
