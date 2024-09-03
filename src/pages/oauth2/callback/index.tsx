import { authClient } from "@/common/axios";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

interface IPostMessageParams {
  message: string,
  status: "success" | "error",
  action: string,
}

export default function Callback() {
  const params = useSearchParams();
  const [message, setMessage] = useState("");
  const code = params.get("code");
  const state = params.get("state");

  const postMessage = (params:IPostMessageParams) => {
    return window?.opener?.postMessage?.(params, window.opener?.location?.origin);
  }

  useEffect(() => {
    if (!code || !state) {
      return;
    }
    const redirectUri = `${window.location.origin}/oauth2/callback`;
    authClient
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/oauth2/callback?code=${code}&state=${state}&redirectUri=${redirectUri}`,
      )
      .then(() => {
        postMessage({
          message: "successfully connected!",
          status: "success",
          action: "oauth2callback",
        })
        setMessage("Connected, you can close this window.");
      })
      .catch(error => {
        postMessage(
          {
            message: error.message,
            status: "error",
            action: "oauth2callback",
          },
        );
        setMessage("Something wrong, you can close this window and retry again.");
        Sentry.captureException(error);
      });
  }, [code, state]);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection={"column"}
    >
      <CircularProgress />
      <Typography
        variant="body1"
        style={{ marginTop: 20 }}
      >
        {message}
      </Typography>
    </Box>
  );
}
