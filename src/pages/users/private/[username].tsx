import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import FooterPrompt from "@/components/explorer/FooterPrompt";

import { Layout } from "@/layout";
import { useGetUserDetailsQuery } from "@/core/api/user";
import Head from "next/head";

const initialUser = { username: "loading", first_name: "loading", last_name: "loading", avatar: undefined, bio: "" };

function PrivateUserProfile() {
  const router = useRouter();
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
        <Stack gap={"32px"}>
          <Box
            position={"relative"}
            width={"152px"}
            height={"152px"}
            borderRadius={"999px"}
            overflow={"hidden"}
          >
            <Image
              src={user.avatar}
              alt={"anonymous"}
              fallback={require("@/assets/images/default-avatar.jpg")}
              fill
            />
          </Box>
          <Stack>
            <Typography
              fontSize={24}
              lineHeight={"28.8px"}
            >
              Anonymous
            </Typography>
            <Typography
              fontSize={14}
              fontWeight={400}
              lineHeight={"22.4px"}
            >
              {user.bio}
            </Typography>
          </Stack>
        </Stack>
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
      <FooterPrompt />
    </Layout>
  );
}

export default PrivateUserProfile;
