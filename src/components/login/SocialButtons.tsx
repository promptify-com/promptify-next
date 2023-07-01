import { GitHub, LinkedIn } from "@mui/icons-material";
import { Box, Grid, Snackbar, Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import React, { useRef, useState } from "react";
import GitHubLogin from "react-github-login";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AxiosResponse } from "axios";
import { Google } from "@/assets/icons/google";
import { client } from "@/common/axios";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { savePathURL, saveToken } from "@/common/utils";
import useSetUser from "@/hooks/useSetUser";
import { Microsoft } from "@/assets/icons/microsoft";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface IProps {
  enabled?: boolean;
  preLogin: () => void;
  postLogin: (data: IContinueWithSocialMediaResponse | null) => void;
  isChecked: boolean;
  setErrorCheckBox: Function;
  from: string;
}

export const SocialButtons: React.FC<IProps> = ({
  postLogin,
  preLogin,
  isChecked,
  setErrorCheckBox,
  from,
}) => {
  const setUser = useSetUser();
  const githubButtonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
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

  const handleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_MICROSOFT_REDIRECT_URI;
    const scope = "openid email profile User.Read";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
    savePathURL("/");
    window.location.href = authUrl;
  };

  const validateConsent = (loginMethod: Function) => {
    if (!isChecked && from === "signup") {
      setOpen(true);
      setErrorCheckBox(false);
    } else loginMethod();
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px",
        gap: "16px",
        width: "100%", //{ xs: '100%', sm: '80%' },
      }}
    >
      <Grid
        onClick={() => validateConsent(loginGoogle)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 22px",
          height: "42px",
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
            fontFamily: "Poppins",
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

      <Grid
        onClick={() => validateConsent(linkedInLogin)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 22px",
          height: "42px",
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
            fontFamily: "Poppins",
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

      <Box hidden ref={githubButtonRef}>
        <GitHubLogin
          clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}
          redirectUri={process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}
          onSuccess={loginWithGitHub}
          className="github-button"
        />
      </Box>

      <Grid
        onClick={() => validateConsent(handleGithubButtonClick)}
        component="span"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 22px",
          height: "42px",
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
            fontFamily: "Poppins",
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

      <Grid
        onClick={() => validateConsent(handleLogin)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 22px",
          height: "42px",
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
            fontFamily: "Poppins",
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
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={"error"}>
          Please accept the terms and conditions.
        </Alert>
      </Snackbar>
    </Box>
  );
};
