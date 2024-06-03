import { Layout } from "@/layout";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";

export default function LoginRedirect() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      window.opener.postMessage({ authorizationCode, action: "loginRedirectionCallback" }, window.location.origin);
      window.close();
    } else {
      console.error("Authorization code not found");
    }
  }, []);

  return (
    <Layout>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ width: "100vw", height: "90vh", fontSize: "20px" }}
      >
        Redirecting...
      </Stack>
    </Layout>
  );
}
