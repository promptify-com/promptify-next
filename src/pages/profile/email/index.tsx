import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "@/hooks/useStore";
import StackedInput from "@/components/common/forms/StackedInput";
import { useState } from "react";
import Button from "@mui/material/Button";

function ProfileEmail() {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [emailValue, setEmailValue] = useState(currentUser?.username);

  const updateEmail = () => {
    console.log("update email");
  };

  const disableSave = Boolean(!emailValue || emailValue === currentUser?.username);

  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="Email"
          description="Here, you can view and manage the email addresses associated with your account."
        >
          <Stack
            alignItems={"flex-start"}
            gap={3}
            p={"8px 16px"}
          >
            <Stack
              alignItems={"flex-start"}
              gap={1}
            >
              <Typography
                fontSize={20}
                fontWeight={400}
                color={"onSurface"}
              >
                Primary Email Address:
              </Typography>
              <Typography
                fontSize={16}
                fontWeight={400}
                color={"secondary.light"}
              >
                Your primary email address is used for account-related communications and notifications. You can update
                it below if necessary.
              </Typography>
            </Stack>
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
                {currentUser?.username}
              </Typography>
            </Stack>
            <StackedInput
              name="email"
              label="Communication Email"
              required
              value={emailValue}
              onChange={e => setEmailValue(e.target.value)}
              onClear={() => setEmailValue("")}
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
