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
import { redirect } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const from = Array.isArray(router?.query?.from)
    ? router?.query?.from[0]
    : router?.query?.from ?? "";
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
  }, [user, userIsLoading, router, error]);

  const preLogin = () => {
    setIsLoading(true);
  };

  const postLogin = (response: IContinueWithSocialMediaResponse | null) => {
    const path = getPathURL();
    if (response?.created) {
      setIsLoading(false);
      setUser(response);
      redirect("/signup");
    } else {
      localStorage.removeItem("path");
      setIsLoading(false);
      if (path) {
        redirect(path);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <>
      <Box>
        {isLoading || userIsLoading ? (
          <PageLoading />
        ) : (
          <LoginLayout preLogin={preLogin} postLogin={postLogin} from={from} />
        )}
      </Box>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}

export default Login;
