import React from "react";
import { Button, Typography } from "@mui/material";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useRouter } from "next/router";

export const SigninButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push("/signin");
      }}
      variant={"contained"}
      startIcon={
        <LogoApp
          width={18}
          color="white"
        />
      }
      sx={{
        flex: 1,
        p: "10px 25px",
        fontWeight: 500,
        borderColor: "primary.main",
        borderRadius: "999px",
        bgcolor: "primary.main",
        color: "onPrimary",
        whiteSpace: "pre-line",
        ":hover": {
          bgcolor: "surface.1",
          color: "primary.main",
        },
      }}
    >
      <Typography
        ml={2}
        color={"inherit"}
      >
        Sign in or Create an account
      </Typography>
    </Button>
  );
};

export default SigninButton;
