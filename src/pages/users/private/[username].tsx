import { useRouter } from "next/router";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Layout } from "@/layout";
import { useGetUserDetailsQuery } from "@/core/api/user";
import useBrowser from "@/hooks/useBrowser";
import Footer from "@/components/Footer";
import UserInformation from "@/components/profile/UserInformation";

const initialUser = { username: "loading", first_name: "loading", last_name: "loading", avatar: "", bio: "", id: 0 };

function PrivateUserProfile() {
  const router = useRouter();
  const { isMobile } = useBrowser();

  const username = router.query.username as string;
  const { data: user = initialUser } = useGetUserDetailsQuery(username, {
    skip: !username,
  });

  return (
    <Layout>
      <Head>
        <meta
          name="robots"
          content="noindex, nofollow"
        />
      </Head>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={"start"}
        pt={{ xs: " 80px", md: "48px" }}
        px={"8px"}
        width={{ xs: "100%", md: "94%" }}
        gap={"50px"}
        mx={"auto"}
      >
        <UserInformation
          username={username}
          user={user}
          privateProfile
        />
        <Stack
          gap={2}
          minHeight={"480px"}
          width={"100%"}
          overflow={"hidden"}
          pr={{ xs: "16px", sm: 0 }}
          sx={{
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
          }}
        >
          <Typography
            fontSize={24}
            fontWeight={400}
            lineHeight={"28.8px"}
            letterSpacing={"0.17px"}
            pl={{ md: "15px" }}
          >
            Prompts by Anonymous
          </Typography>

          <Stack
            minHeight={"60svh"}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography color={"text.secondary"}>This profile is private.</Typography>
          </Stack>
        </Stack>
      </Stack>

      {!isMobile && <Footer />}
    </Layout>
  );
}

export default PrivateUserProfile;
