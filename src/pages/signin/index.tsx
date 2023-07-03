import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { getPathURL } from "@/common/utils";
import { PageLoading } from "@/components/PageLoading";
import { useGetCurrentUser } from "@/hooks/api/user";
import useSetUser from "@/hooks/useSetUser";
import useToken from "@/hooks/useToken";
import { LoginLayout } from "@/components/login/LoginLayout";
import { useRouter } from "next/router";
import Head from "next/head";

const Login = () => {
  const router = useRouter();
  const from = Array.isArray(router?.query?.from)
    ? router?.query?.from[0]
    : router?.query?.from || "";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = useToken();
  const setUser = useSetUser();
  const [user, error, userIsLoading] = useGetCurrentUser([token]);

  useEffect(() => {
    if (!userIsLoading && user) {
      router.push("/");
    }

    if (error) {
      console.log(error);
    }
  }, [user]);

  const preLogin = () => {
    setIsLoading(true);
  };

  const postLogin = (response: IContinueWithSocialMediaResponse | null) => {
    setIsLoading(false);

    if (response && response.created) {
      setUser(response);
      router.push("/signup");
    } else {
      const path = getPathURL();
      localStorage.removeItem("path");
      if (!!path) {
        router.push(path);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Promptify | Boost Your Creativity</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        {isLoading || userIsLoading ? (
          <PageLoading />
        ) : (
          // <Box display="flex" sx={{ minHeight: '100vh', width: '100vw' }}>
          //   <Box
          //     display="flex"
          //     flexDirection="column"
          //     alignContent="center"
          //     width={{ xs: '100vw', lg: '55vw' }}
          //   >
          //     <Box
          //       sx={{
          //         width: { xs: '70%', lg: '60%' },
          //         alignSelf: 'center',
          //         mt: { xs: '2rem', md: '4rem', lg: '5rem', xl: '6rem' },
          //       }}
          //     >
          //       <Link
          //         to="/">
          //         <LogoWithName />
          //       </Link>
          //       <Typography
          //         sx={{
          //           fontSize: { xs: '1.2rem', md: '1.6rem', lg: '1.8rem', xl: '2rem' },
          //           mt: { xs: '4rem', md: '8rem', lg: '10rem', xl: '12rem' },
          //           fontWeight: 500,
          //         }}
          //       >
          //         Welcome to Promptify
          //       </Typography>

          //       <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
          //         <LoginSocialButtons preLogin={preLogin} postLogin={postLogin} />
          //       </GoogleOAuthProvider>
          //     </Box>
          //   </Box>
          //   <Box
          //     sx={{ display: { xs: 'none', lg: 'flex' } }}
          //     bgcolor="#4F4F4F"
          //     width="45vw"
          //     justifyContent="center"
          //     alignItems="center"
          //   >
          //     <Typography sx={{ fontSize: '1.8rem' }} color="#D2D2D2" width="50%" textAlign="center">
          //       Emotional marketing content
          //     </Typography>
          //   </Box>
          // </Box>

          <LoginLayout preLogin={preLogin} postLogin={postLogin} from={from} />
        )}
      </Box>
    </>
  );
};
export default Login;
