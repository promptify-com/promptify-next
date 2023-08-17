import { useState } from "react";
import { Box } from "@mui/material";
import { PageLoading } from "@/components/PageLoading";
import useToken from "@/hooks/useToken";
import { LoginLayout } from "@/components/login/LoginLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { isValidUserFn } from "@/core/store/userSlice";
import useLogout from "@/hooks/useLogout";

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const saveToken = useToken();
  const isValidUser = useSelector(isValidUserFn);
  const logoutUser = useLogout();

  if (isValidUser) {
    if (!saveToken) {
      logoutUser();
    } else {
      router.push("/");
    }

    return <PageLoading />;
  }

  const preLogin = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  return (
    <>
      <Box>
        {isLoading ? (
          <PageLoading />
        ) : (
          <LoginLayout preLogin={preLogin} />
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
