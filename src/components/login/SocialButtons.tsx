import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import GitHubLogin from "react-github-login";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { useGoogleLogin } from "@react-oauth/google";
import { AxiosResponse } from "axios";
import { Google } from "@/assets/icons/google";
import { client } from "@/common/axios";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { savePathURL, saveToken } from "@/common/utils";
import { Microsoft } from "@/assets/icons/microsoft";
import { getPathURL } from "@/common/utils";
import { updateUser } from "@/core/store/userSlice";
import { useDispatch } from "react-redux";
import { userApi } from "@/core/api/user";
import { redirectToPath } from "@/common/helpers";
import { setToast } from "@/core/store/toastSlice";

const CODE_TOKEN_ENDPOINT = "/api/login/social/token/";

interface IProps {
  preLogin?: (isLoading: boolean) => void;
  isChecked?: boolean;
  setErrorCheckBox?: Dispatch<SetStateAction<boolean>>;
  from?: string;
  asList?: boolean;
}

export default function SocialButtons({
  preLogin = () => null,
  isChecked,
  setErrorCheckBox = () => null,
  from,
  asList,
}: IProps) {
  const githubButtonRef = useRef<HTMLButtonElement | null>(null);
  const [attemptError, setAttemptError] = useState(false);
  const dispatch = useDispatch();
  const [getCurrentUser] = userApi.endpoints.getCurrentUser.useLazyQuery();
  const doPostLogin = async (response: AxiosResponse<IContinueWithSocialMediaResponse> | null) => {
    if (response?.data) {
      const { token, created } = response.data;
      const path = getPathURL();
      // response.data has corrupted user data, so we need to call this API to get proper user data
      const payload = await getCurrentUser(token).unwrap();

      savePathURL("no-redirect");
      dispatch(updateUser(payload));
      saveToken({ token });

      if (created) {
        redirectToPath("/onboarding");
        return;
      }
      redirectToPath(path || "/");
      return;
    }

    setAttemptError(true);
    preLogin(false);
  };

  const initAttempt = () => {
    setAttemptError(false);
    preLogin(true);
  };
  const loginWithGoogle = useGoogleLogin({
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
    const width = 600;
    const height = 700;
    const left = Math.ceil(window.screen.width / 2 - width / 2);
    const top = Math.ceil(window.screen.height / 2 - height / 2);
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

    const authWindow = window.open(
      authUrl,
      "Microsoft Login",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (authWindow) {
      window.addEventListener(
        "message",
        event => {
          if (event.origin === window.location.origin) {
            const { authorizationCode, action } = event.data;

            if (authorizationCode && action === "loginRedirectionCallback") {
              client
                .post(CODE_TOKEN_ENDPOINT, {
                  provider: "microsoft",
                  code: authorizationCode,
                })
                .then((response: AxiosResponse<IContinueWithSocialMediaResponse>) => {
                  doPostLogin(response);
                })
                .catch(reason => {
                  console.warn("Could not authenticate via Microsoft:", reason);
                });
            }
          }
        },
        { once: true },
      );
    }
  };
  const validateConsent = (loginMethod: Function) => {
    if (!isChecked && from === "signup") {
      dispatch(
        setToast({
          message: "Please accept the terms and conditions.",
          severity: "error",
          duration: 6000,
          position: { vertical: "bottom", horizontal: "right" },
        }),
      );
      setErrorCheckBox(false);
    } else {
      loginMethod();
    }
  };

  const socialBtnStyle = {
    display: "flex",
    justifyContent: asList ? "flex-start" : "center",
    alignItems: "center",
    padding: "8px 22px",
    height: "42px",
    width: "100%",
    background: "transparent",
    borderRadius: asList ? 0 : "100px",
    border: asList ? "none" : "1px solid #3b405026",
    gap: "0.5em",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: "rgba(0, 0, 0, 0.15) 0 0 1px",
    },
    ...(asList && { borderBottom: "1px solid #3b405026" }),
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px",
        gap: asList ? 0 : "16px",
        width: "100%",
      }}
    >
      {attemptError && (
        <Box p={"8px 22px"}>
          <Typography
            sx={{
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
        onClick={() => validateConsent(loginWithGoogle)}
        sx={socialBtnStyle}
      >
        <Google />
        <Typography
          sx={{
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
        sx={socialBtnStyle}
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
        sx={socialBtnStyle}
      >
        <GitHub sx={{ color: "#171515" }} />
        <Typography
          sx={{
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
        sx={socialBtnStyle}
      >
        <Microsoft />
        <Typography
          sx={{
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
    </Box>
  );
}
