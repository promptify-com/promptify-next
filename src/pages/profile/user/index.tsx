import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Avatar, Button, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import { useAppSelector } from "@/hooks/useStore";

interface SectionWrapperProps {
  title: string;
  children: ReactNode;
}
const SectionWrapper = ({ title, children }: SectionWrapperProps) => (
  <Stack
    gap={2}
    p={"8px 16px"}
  >
    <Typography
      fontSize={20}
      fontWeight={400}
      color={"onSurface"}
    >
      {title}
    </Typography>
    {children}
  </Stack>
);

const ProfilePrompts = () => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [isPublic, setIsPublic] = useState(true);

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
                    onChange={(_, checked) => setIsPublic(checked)}
                  />
                }
                label={isPublic ? "Yes" : "No"}
                sx={{
                  flexDirection: "row-reverse",
                  gap: 2,
                  m: 0,
                }}
              />
            </Stack>
            <SectionWrapper title="Profile image:">
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{
                  p: "24px",
                  border: "1px solid",
                  borderRadius: "16px",
                  borderColor: "surfaceContainerHighest",
                }}
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
                  <Button>Select Image</Button>
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
          </Stack>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "User profile",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfilePrompts;
