import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import StackedInput from "@/components/common/forms/StackedInput";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SectionWrapper from "@/components/profile2/SectionWrapper";
import { useUpdateUserProfileMutation } from "@/core/api/user";
import useToken from "@/hooks/useToken";
import { updateUser } from "@/core/store/userSlice";
import { isValidEmail } from "@/common/helpers";

function ProfileEmail() {
  const token = useToken();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [communicationEmail, setCommunicationEmail] = useState("");

  useEffect(() => {
    setCommunicationEmail(currentUser?.communication_email ?? currentUser?.email ?? "");
  }, [currentUser]);

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const updateEmail = async () => {
    if (!isValidEmail(communicationEmail)) return;

    const user = await updateUserProfile({
      token,
      data: { communication_email: communicationEmail },
    }).unwrap();
    dispatch(updateUser(user));
  };

  const disableSave =
    isLoading ||
    Boolean(!communicationEmail || communicationEmail === currentUser?.communication_email) ||
    !isValidEmail(communicationEmail);

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="Email"
          description="Here, you can view and manage the email addresses associated with your account."
        >
          <SectionWrapper
            title="Primary Email Address:"
            description="Your primary email address is used for account-related communications and notifications. You can update
                it below if necessary."
            noBorder
          >
            <Stack
              alignItems={"flex-start"}
              gap={3}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={2}
                sx={{
                  width: "calc(100% - 32px)",
                  border: "1px solid",
                  borderColor: "surfaceContainerHighest",
                  borderRadius: "16px",
                  p: "16px 8px 16px 24px",
                }}
              >
                <Typography
                  flex={2}
                  fontSize={14}
                  fontWeight={500}
                  color={"secondary.light"}
                >
                  Email
                </Typography>
                <Typography
                  flex={4}
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  {currentUser?.email}
                </Typography>
              </Stack>
              <StackedInput
                name="email"
                label="Communication Email"
                required
                value={communicationEmail}
                onChange={e => setCommunicationEmail(e.target.value)}
                onClear={() => setCommunicationEmail("")}
                sx={{
                  border: "1px solid",
                  borderColor: "surfaceContainerHighest",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              />
              <Button
                variant="contained"
                onClick={updateEmail}
                disabled={disableSave}
                sx={{
                  ":disabled": {
                    borderColor: "transparent",
                  },
                }}
              >
                Save changes
              </Button>
            </Stack>
          </SectionWrapper>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Email",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfileEmail;
