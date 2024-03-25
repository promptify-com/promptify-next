import { useAppSelector } from "@/hooks/useStore";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { theme } from "@/theme";
import ChatsSuggestions from "../../components/common/ChatsSuggestions";

const Profile = () => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  return (
    <Protected>
      <Layout>
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
            py="48px"
            width={"85%"}
          >
            <Stack
              alignItems={"center"}
              gap={2}
            >
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
              <Typography
                fontSize={32}
                fontWeight={400}
                letterSpacing={"0.17px"}
                color={"onSurface"}
              >
                Welcome, {currentUser?.username}
              </Typography>
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
      </Layout>
    </Protected>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "My Account",
      description: SEO_DESCRIPTION,
    },
  };
}

export default Profile;
