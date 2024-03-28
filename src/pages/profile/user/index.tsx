import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ProfileImageButton } from "@/components/profile2/ProfileImageButton";
import Box from "@mui/material/Box";
import StackedInput from "@/components/common/forms/StackedInput";
import { useFormik } from "formik";
import { IEditProfile } from "@/common/types";
import { useRouter } from "next/router";
import { useUpdateUserPreferencesMutation, useUpdateUserProfileMutation } from "@/core/api/user";
import { updateUser } from "@/core/store/userSlice";
import useToken from "@/hooks/useToken";
import Button from "@mui/material/Button";
import SectionWrapper from "@/components/profile2/SectionWrapper";

function ProfilePrompts() {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useToken();

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [updateUserPreferences, { isLoading: isLoadingPreferences }] = useUpdateUserPreferencesMutation();

  const handleTogglePublic = async (checked: boolean) => {
    if (!currentUser) return;

    const preferences = await updateUserPreferences({
      username: currentUser.username,
      data: { is_public: checked },
    }).unwrap();
    dispatch(updateUser({ ...currentUser, preferences }));
  };

  const onSubmit = async (values: IEditProfile) => {
    const payload = await updateUserProfile({ token, data: values }).unwrap();
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
    },
    enableReinitialize: true,
    onSubmit,
  });

  const isPublic = currentUser?.preferences.is_public;

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="User profile"
          description="Here, you can manage your personal information and customize your profile"
        >
          <Stack gap={5}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={2}
              p={"16px"}
            >
              <Stack gap={1}>
                <Typography
                  fontSize={20}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  Public profile
                </Typography>
                <Typography
                  fontSize={14}
                  fontWeight={400}
                  color={"secondary.light"}
                >
                  Show you profile to other users
                </Typography>
              </Stack>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(_, checked) => handleTogglePublic(checked)}
                  />
                }
                label={isPublic ? "Yes" : "No"}
                sx={{
                  flexDirection: "row-reverse",
                  gap: 2,
                  m: 0,
                  ".MuiFormControlLabel-label": {
                    fontSize: 16,
                    fontWeight: 400,
                    color: "onSurface",
                  },
                }}
              />
            </Stack>
            <SectionWrapper title="Profile image:">
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                p={"24px"}
              >
                <Avatar
                  src={currentUser?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                  alt={currentUser?.first_name?.slice(0, 1) ?? "P"}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    backgroundColor: "black",
                    color: "white",
                    fontSize: "40px",
                  }}
                />
                <Stack
                  gap={1}
                  alignItems={"flex-end"}
                >
                  <ProfileImageButton />
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color={"secondary.light"}
                  >
                    At least 240x240 px, jpg or png
                  </Typography>
                </Stack>
              </Stack>
            </SectionWrapper>
            <Stack gap={1}>
              <SectionWrapper title="Basic information:">
                <StackedInput
                  name="first_name"
                  label="First name"
                  required
                  value={formik.values.first_name}
                  helperText={formik.touched.first_name && formik.errors.first_name}
                  error={!!formik.touched.first_name && Boolean(formik.errors.first_name)}
                  onChange={formik.handleChange}
                  onClear={() => formik.setFieldValue("first_name", "")}
                />
                <StackedInput
                  name="last_name"
                  label="Last name"
                  required
                  value={formik.values.last_name}
                  helperText={formik.touched.last_name && formik.errors.last_name}
                  error={!!formik.touched.last_name && Boolean(formik.errors.last_name)}
                  onChange={formik.handleChange}
                  onClear={() => formik.setFieldValue("last_name", "")}
                />
                <StackedInput
                  name="username"
                  label="Nickname"
                  required
                  value={formik.values.username}
                  helperText={formik.touched.username && formik.errors.username}
                  error={!!formik.touched.username && Boolean(formik.errors.username)}
                  onChange={formik.handleChange}
                  onClear={() => formik.setFieldValue("username", "")}
                />
              </SectionWrapper>
              <Typography
                fontSize={14}
                fontWeight={400}
                color={"secondary.light"}
                px={"32px"}
              >
                Nickname will be used as link to your profile:{" "}
                <Box
                  component={"span"}
                  color={"primary.main"}
                >
                  www.promptify.com/users/{currentUser?.username}
                </Box>
              </Typography>
            </Stack>
            <SectionWrapper title="About you:">
              <StackedInput
                name="bio"
                label="Short profile description"
                required
                value={formik.values.bio}
                helperText={formik.touched.bio && formik.errors.bio}
                error={!!formik.touched.bio && Boolean(formik.errors.bio)}
                onChange={formik.handleChange}
                onClear={() => formik.setFieldValue("bio", "")}
                rows={3}
              />
            </SectionWrapper>
            <SectionWrapper
              title="Delete Account"
              description="If you wish to permanently delete your account, please be aware that this action is irreversible and
              will result in the loss of all your account data, including chat history and documents."
              noBorder
            >
              <Button
                onClick={() => console.log("delete account")}
                sx={{
                  border: "1px solid",
                  borderColor: "surfaceContainerHigh",
                  p: "8px 24px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "onSurface",
                }}
              >
                Delete account
              </Button>
            </SectionWrapper>
            <Stack
              direction={"row"}
              gap={2}
              p={"8px 16px"}
            >
              <Button
                variant="contained"
                onClick={formik.submitForm}
                disabled={isLoading}
              >
                Save changes
              </Button>
              <Button
                onClick={() => {}}
                sx={{ color: "onSurface" }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "User profile",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfilePrompts;
