import { authClient } from "@/common/axios";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Callback() {
  const params = useSearchParams();
  const [message, setMessage] = useState("");
  const code = params.get("code");
  const state = params.get("state");
  useEffect(() => {
    if (!code || !state) {
      return;
    }
    const redirectUri = `${window.location.origin}/oauth2/callback`;
    authClient
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/oauth2/callback?code=${code}&state=${state}&redirectUri=${redirectUri}`,
      )
      .then(data => {
        window.opener.postMessage(
          {
            message: "successfully connected!",
            status: "success",
          },
          window.opener.location.origin,
        );
        setMessage("Connected, you can close this window.");
      })
      .catch(error => {
        window.opener.postMessage(
          {
            message: error.message,
            status: "error",
          },
          window.opener.location.origin,
        );
        setMessage("Something wrong, you can close this window and retry again.");
      });
  }, [code, state]);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
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
