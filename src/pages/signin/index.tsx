import { useState } from "react";
import Box from "@mui/material/Box";
import { PageLoading } from "@/components/PageLoading";
import useToken from "@/hooks/useToken";
import { LoginLayout } from "@/components/login/LoginLayout";
import { useSelector } from "react-redux";
import { isValidUserFn } from "@/core/store/userSlice";
import useLogout from "@/hooks/useLogout";
import { deletePathURL, getPathURL } from "@/common/utils";

import SigninPlaceholder from "@/components/placeholders/SigninPlaceholder";
import { redirectToPath } from "@/common/helpers";

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const saveToken = useToken();
  const isValidUser = useSelector(isValidUserFn);
  const logoutUser = useLogout();
  const path = getPathURL();

  if (isValidUser) {
    if (!saveToken) {
      logoutUser();
    } else {
      if (path === "no-redirect") {
        deletePathURL();
        return;
      }

      redirectToPath("/");
    }

    return <PageLoading />;
  }

  const preLogin = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  return (
    <>
      <Box>{isLoading ? <SigninPlaceholder /> : <LoginLayout preLogin={preLogin} />}</Box>
    </>
  );
};

export async function getStaticProps() {
  return { props: {} };
}

export default Login;
