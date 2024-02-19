import { authClient } from "@/common/axios";
import Storage from "@/common/storage";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Callback() {
  const params = useSearchParams();
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
            data: JSON.stringify(data),
          },
          window.opener.location.origin,
        );
      })
      .catch(error => {
        window.opener.postMessage(
          {
            message: error.message,
            status: "error",
          },
          window.opener.location.origin,
        );
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
    </Box>
  );
}
