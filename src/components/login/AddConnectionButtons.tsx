import { GitHub, LinkedIn } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import React, { useRef } from "react";
import GitHubLogin from "react-github-login";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { AxiosResponse } from "axios";
import { Google } from "@/assets/icons/google";
import { Microsoft } from "@/assets/icons/microsoft";
import { authClient } from "@/common/axios";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { saveToken } from "@/common/utils";
import useToken from "@/hooks/useToken";
import { useDispatch } from "react-redux";
import { updateUser } from "@/core/store/userSlice";
import { setToast } from "@/core/store/toastSlice";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

interface IProps {
  enabled?: boolean;
  preLogin: () => void;
  postLogin: (data: IContinueWithSocialMediaResponse | null) => void;
  authConnection: string[];
  setOpenAdd: Function;
}

export const AddConnectionButtons: React.FC<IProps> = ({ postLogin, preLogin, authConnection, setOpenAdd }) => {
  const dispatch = useDispatch();
  const savedToken = useToken();
  const githubButtonRef = useRef<HTMLButtonElement | null>(null);
  const doPostLogin = (r: AxiosResponse<IContinueWithSocialMediaResponse>) => {
    const { token, created, ...userProps } = r.data;

    if (token !== savedToken) {
      setOpenAdd(false);
      dispatch(
        setToast({
          message: "You already have this connection attached to another account",
          severity: "info",
          duration: 6000,
        }),
      );
    } else {
      dispatch(updateUser(userProps));
      saveToken({ token });
      postLogin(r.data);
    }
  };

  //add connectionfor google
  const loginGoogle = useGoogleLogin({
    onSuccess: ({ code }) => {
      preLogin();
      authClient
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

  //add connection for github
  const loginWithGitHub = ({ code }: { code: string }) => {
    preLogin();
    authClient
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

  //add connection for linkedin
  const { linkedInLogin } = useLinkedIn({
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID as string,
    redirectUri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI as string,
    scope: "r_emailaddress,r_liteprofile",
    onSuccess: code => {
      preLogin();
      authClient
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "linkedin",
          code,
        })
        .then(doPostLogin)
        .catch(() => postLogin(null));
    },
    onError: error => {
      console.log(error);
      postLogin(null);
    },
  });

  // add connection with microsoft
  const microsoftLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_MICROSOFT_REDIRECT_URI;
    const scope = "openid email profile User.Read";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px",
        gap: "16px",
      }}
    >
      {!authConnection.includes("google") && (
        <Grid
          onClick={loginGoogle}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 22px",
            height: { xs: "50px", sm: "42px" },
            width: "100%",
            background: "#3B4050",
            boxShadow:
              "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            borderRadius: "100px",
            gap: "0.5em",
            "&:hover": {
              transform: "scale(1.005)",
              cursor: "pointer",
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            },
          }}
        >
          <Google />
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "15px",
              lineHeight: "26px",
              letterSpacing: "0.46px",
              color: "#FFFFFF",
            }}
          >
            Continue with Google
          </Typography>
        </Grid>
      )}

      {!authConnection.includes("linkedin") && (
        <Grid
          onClick={linkedInLogin}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 22px",
            height: { xs: "50px", sm: "42px" },
            width: "100%",
            background: "#1877F2",
            boxShadow:
              "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            borderRadius: "100px",
            gap: "0.5em",
            "&:hover": {
              transform: "scale(1.005)",
              cursor: "pointer",
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            },
          }}
        >
          <LinkedIn sx={{ color: "white" }} />
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "15px",
              lineHeight: "26px",
              letterSpacing: "0.46px",
              color: "#FFFFFF",
            }}
          >
            Continue with LinkedIn
          </Typography>
        </Grid>
      )}

      <Box
        hidden
        ref={githubButtonRef}
      >
        <GitHubLogin
          clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}
          redirectUri={process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}
          onSuccess={loginWithGitHub}
          className="github-button"
        />
      </Box>

      {!authConnection.includes("github") && (
        <Grid
          onClick={handleGithubButtonClick}
          component="span"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 22px",
            height: { xs: "50px", sm: "42px" },
            width: "100%",
            background: "#FF4500",
            boxShadow:
              "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            borderRadius: "100px",
            gap: "0.5em",
            "&:hover": {
              transform: "scale(1.005)",
              cursor: "pointer",
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            },
          }}
        >
          <GitHub sx={{ color: "white" }} />
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "15px",
              lineHeight: "26px",
              letterSpacing: "0.46px",
              color: "#FFFFFF",
            }}
          >
            Continue with GitHub
          </Typography>
        </Grid>
      )}

      {!authConnection.includes("microsoft") && (
        <Grid
          onClick={microsoftLogin}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 22px",
            height: { xs: "50px", sm: "42px" },
            width: "100%",
            background: "#1877f280",
            boxShadow:
              "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            borderRadius: "100px",
            gap: "0.5em",
            "&:hover": {
              transform: "scale(1.005)",
              cursor: "pointer",
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            },
          }}
        >
          <Microsoft />
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "15px",
              lineHeight: "26px",
              letterSpacing: "0.46px",
              color: "#FFFFFF",
            }}
          >
            Continue with Microsoft
          </Typography>
        </Grid>
      )}
    </Box>
  );
};
