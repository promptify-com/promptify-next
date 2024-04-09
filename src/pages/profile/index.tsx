import { useAppSelector } from "@/hooks/useStore";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChatsSuggestions from "@/components/common/ChatsSuggestions";
import { useTheme } from "@mui/material/styles";
import { isDesktopViewPort } from "@/common/helpers";
import UserLayout from "@/components/profile2/UserLayout";

function Profile() {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const theme = useTheme();
  const desktopView = isDesktopViewPort();
  return (
    <Protected>
      <Layout>
        <UserLayout title={"My Account"}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={{
              xs: `calc(100svh - ${theme.custom.headerHeight.xs})`,
              md: `calc(100svh - ${theme.custom.headerHeight.md})`,
            }}
          >
            <Stack
              gap={3}
              pt={{ xs: 0, md: "48px" }}
              pb="48px"
              width={{ xs: "100%", md: "85%" }}
            >
              <Stack
                alignItems={{ xs: "flex-start", md: "center" }}
                gap={2}
                p={{ xs: "16px", md: 0 }}
              >
                {desktopView && (
                  <Avatar
                    src={currentUser?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                    alt={currentUser?.first_name?.slice(0, 1) ?? "P"}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "40px",
                    }}
                  />
                )}
                <Typography
                  fontSize={24}
                  fontWeight={400}
                  letterSpacing={"0.17px"}
                  color={"onSurface"}
                >
                  Welcome, {currentUser?.username}
                </Typography>

                {!desktopView && (
                  <Typography
                    sx={{
                      color: "var(--onSurface, var(--onSurface, #1B1B1F))",
                      fontFeatureSettings: "'clig' off, 'liga' off",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "160%",
                      letterSpacing: "0.17px",
                    }}
                  >
                    Here, you can manage your personal information and customize your profile
                  </Typography>
                )}
              </Stack>

              <Box
                sx={{
                  p: "16px",
                  ".suggest-card": {
                    width: "auto !important",
                  },
                }}
              >
                <ChatsSuggestions slice={1} />
              </Box>
            </Stack>
          </Stack>
        </UserLayout>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "My Account",
      description: SEO_DESCRIPTION,
    },
  };
}

export default Profile;
