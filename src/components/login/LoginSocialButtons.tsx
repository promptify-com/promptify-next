import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import { Google, LinkedIn, GitHub } from "@mui/icons-material";
import { useGoogleLogin } from "@react-oauth/google";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import GitHubLogin from "react-github-login";

import { client } from "@/common/axios";
import { saveToken } from "@/common/utils";
import useSetUser from "@/hooks/useSetUser";
import { AxiosResponse } from "axios";
import { IContinueWithSocialMediaResponse } from "@/common/types";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

interface IProps {
  enabled?: boolean;
  preLogin: () => void;
  postLogin: (data: IContinueWithSocialMediaResponse | null) => void;
}

export const LoginSocialButtons: React.FC<IProps> = ({
  enabled = true,
  postLogin,
  preLogin,
}) => {
  const setUser = useSetUser();
  const githubButtonRef = useRef<HTMLButtonElement | null>(null);

  const doPostLogin = (r: AxiosResponse<IContinueWithSocialMediaResponse>) => {
    setUser(r.data);
    saveToken(r.data);
    postLogin(r.data);
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: ({ code }) => {
      preLogin();
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "google",
          code,
        })
        .then(doPostLogin)
        .catch(() => postLogin(null));
    },
    flow: "auth-code",
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  });

  const { linkedInLogin } = useLinkedIn({
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID as string,
    redirectUri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI as string,
    scope: "r_emailaddress,r_liteprofile",
    onSuccess: (code) => {
      preLogin();
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "linkedin",
          code,
        })
        .then(doPostLogin)
        .catch(() => postLogin(null));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const loginWithGitHub = ({ code }: { code: string }) => {
    preLogin();
    client
      .post(CODE_TOKEN_ENDPOINT, {
        provider: "github",
        code,
      })
      .then(doPostLogin)
      .catch(() => postLogin(null));
  };

  const handleGithubButtonClick = () => {
    // hack because the React GitHub oauth2 library is trash
    (githubButtonRef?.current?.children[0] as HTMLButtonElement).click();
  };

  return (
    <Box>
      <Button
        disabled={!enabled}
        onClick={loginGoogle}
        startIcon={<Google />}
        sx={{
          bgcolor: "#4285F4",
          width: "100%",
          mt: "2rem",
          height: "3rem",
          borderRadius: 2,
          justifyContent: "flex-start",
          paddingLeft: "2rem",
          color: "#E2E2E2",
          textTransform: "none",
          fontSize: { xs: "0.8rem", sm: "1rem" },
        }}
      >
        Continue with Google
      </Button>

      <Button
        disabled={!enabled}
        onClick={linkedInLogin}
        startIcon={<LinkedIn />}
        sx={{
          bgcolor: "#737373",
          width: "100%",
          mt: 1,
          height: "3rem",
          borderRadius: 2,
          justifyContent: "flex-start",
          paddingLeft: "2rem",
          color: "#E2E2E2",
          textTransform: "none",
          fontSize: { xs: "0.8rem", sm: "1rem" },
        }}
      >
        Continue with LinkedIn
      </Button>

      <Box hidden ref={githubButtonRef}>
        <GitHubLogin
          clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}
          redirectUri={process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}
          onSuccess={loginWithGitHub}
          className="github-button"
        />
      </Box>

      <Button
        onClick={handleGithubButtonClick}
        disabled={!enabled}
        component="span"
        startIcon={<GitHub />}
        sx={{
          bgcolor: "#171515",
          width: "100%",
          mt: 1,
          height: "3rem",
          borderRadius: 2,
          justifyContent: "flex-start",
          paddingLeft: "2rem",
          color: "#E2E2E2",
          textTransform: "none",
          fontSize: { xs: "0.8rem", sm: "1rem" },
        }}
      >
        Continue with GitHub
      </Button>
    </Box>
  );
};
