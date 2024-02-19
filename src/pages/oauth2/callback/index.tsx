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
        Storage.set("oauthStatus", JSON.stringify({ data: data.data }));
        window.close();
      })
      .catch(error => {
        Storage.set("oauthStatus", JSON.stringify({ status: "error", error: error }));
        window.close();
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
