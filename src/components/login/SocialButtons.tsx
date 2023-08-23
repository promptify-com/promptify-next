import { GitHub, LinkedIn } from "@mui/icons-material";
import { Box, Grid, Snackbar, Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useRef, useState, forwardRef } from "react";
import GitHubLogin from "react-github-login";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AxiosResponse } from "axios";
import { Google } from "@/assets/icons/google";
import { client } from "@/common/axios";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { savePathURL, saveToken } from "@/common/utils";
import { Microsoft } from "@/assets/icons/microsoft";
import { getPathURL } from "@/common/utils";
import { useRouter } from "next/router";
import { updateUser } from "@/core/store/userSlice";
import { useDispatch } from "react-redux";
import { userApi } from "@/core/api/user";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
    />
  );
});

interface IProps {
  preLogin: (isLoading: boolean) => void;
  isChecked: boolean;
  setErrorCheckBox: Function;
  from: string;
}

export const SocialButtons: React.FC<IProps> = ({ preLogin, isChecked, setErrorCheckBox, from }) => {
  const githubButtonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [attemptError, setAttemptError] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();
  const doPostLogin = async (response: AxiosResponse<IContinueWithSocialMediaResponse> | null) => {
    if (response?.data) {
      const { token, created: _ } = response.data;
      const path = getPathURL();
      // response.data has corrupted user data, so we need to call this API to get proper user data
      const payload = await getCurrentUser(token).unwrap();

      savePathURL("no-redirect");
      dispatch(updateUser(payload));
      saveToken({ token });

      router.push(path || "/");
      return;
    }

    setAttemptError(true);
    preLogin(false);
  };

  const initAttempt = () => {
    setAttemptError(false);
    preLogin(true);
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: ({ code }) => {
      initAttempt();
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "google",
          code,
        })
        .then(doPostLogin)
        .catch(() => doPostLogin(null));
    },
    flow: "auth-code",
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  });
  const { linkedInLogin } = useLinkedIn({
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID as string,
    redirectUri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI as string,
    scope: "r_emailaddress,r_liteprofile",
    onSuccess: code => {
      initAttempt();
      client
        .post(CODE_TOKEN_ENDPOINT, {
          provider: "linkedin",
          code,
        })
        .then(doPostLogin)
        .catch(() => doPostLogin(null));
    },
    onError: error => {
      console.log(error);
    },
  });
  const loginWithGitHub = ({ code }: { code: string }) => {
    initAttempt();
    client
      .post(CODE_TOKEN_ENDPOINT, {
        provider: "github",
        code,
      })
      .then(doPostLogin)
      .catch(() => doPostLogin(null));
  };
  const handleGithubButtonClick = () => {
    // hack because the React GitHub oauth2 library is trash
    (githubButtonRef?.current?.children[0] as HTMLButtonElement).click();
  };
  const loginWithMicrosoft = async () => {
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
    } else {
      loginMethod();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px",
        gap: "16px",
        width: "100%",
      }}
    >
      {attemptError && (
        <Box
          sx={{
            display: "flex",
            alignSelf: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              color: "red",
              display: "inline",
            }}
          >
            Something went wrong, please try again.
          </Typography>
        </Box>
      )}
      <Grid
        onClick={() => validateConsent(loginGoogle)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 22px",
          height: "42px",
          width: "100%",
          background: "transparent",
          borderRadius: "100px",
          border: "1px solid var(--primary-states-outlined-border, rgba(59, 64, 80, 0.15))",
          gap: "0.5em",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "rgba(0, 0, 0, 0.15) 0 0 1px",
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
            color: "#3B4050",
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
          background: "transparent",
          borderRadius: "100px",
          border: "1px solid var(--primary-states-outlined-border, rgba(59, 64, 80, 0.15))",
          gap: "0.5em",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "rgba(0, 0, 0, 0.15) 0 0 1px",
          },
        }}
      >
        <LinkedIn
          sx={{
            color: "#0072b1",
            width: "24px",
            height: "24px",
            fontSize: "30px",
          }}
        />
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "15px",
            lineHeight: "26px",
            letterSpacing: "0.46px",
            color: "#3B4050",
          }}
        >
          Continue with LinkedIn
        </Typography>
      </Grid>

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
          background: "transparent",
          borderRadius: "100px",
          border: "1px solid var(--primary-states-outlined-border, rgba(59, 64, 80, 0.15))",
          gap: "0.5em",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "rgba(0, 0, 0, 0.15) 0 0 1px",
          },
        }}
      >
        <GitHub sx={{ color: "#171515" }} />
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "15px",
            lineHeight: "26px",
            letterSpacing: "0.46px",
            color: "#3B4050",
          }}
        >
          Continue with GitHub
        </Typography>
      </Grid>

      <Grid
        onClick={() => validateConsent(loginWithMicrosoft)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 22px",
          height: "42px",
          width: "100%",
          background: "transparent",
          borderRadius: "100px",
          border: "1px solid var(--primary-states-outlined-border, rgba(59, 64, 80, 0.15))",
          gap: "0.5em",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "rgba(0, 0, 0, 0.15) 0 0 1px",
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
            color: "#3B4050",
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
        <Alert severity={"error"}>Please accept the terms and conditions.</Alert>
      </Snackbar>
    </Box>
  );
};
