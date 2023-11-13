import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import BaseButton from "@/components/base/BaseButton";
import useToken from "@/hooks/useToken";

export const WelcomeCard = () => {
  const router = useRouter();
  const token = useToken();
  const [showContainer, setShowContainer] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowContainer(true);
    }
  }, [token]);

  return (
    <Stack
      bgcolor={"surface.1"}
      sx={{
        padding: { xs: "16px", md: "24px" },
        borderRadius: "25px",
        gap: { xs: "25px", sm: "48px", md: "10px", lg: "48px" },
        flexDirection: { xs: "column", sm: "row" },
        display: !showContainer ? "none" : "flex",
      }}
    >
      <Stack
        sx={{
          paddingBlock: "8px",
          paddingInline: {
            xs: "40px",
            sm: "8px",
            md: "8px",
            lg: "40px",
          },
          width: "152px",
          height: "162px",
          position: "relative",
          alignItems: "center",
          mx: "auto",
        }}
      >
        <Image
          src="/welcome.svg"
          alt="welcome"
          fill
          priority={true}
        />
      </Stack>

      <Stack
        flex={1}
        justifyContent="center"
        sx={{ alignItems: { xs: "center", sm: "flex-start" } }}
      >
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "24px",
            lineHeight: "28px",
            letterSpacing: "0.15px",
            color: "#1D2028",
            marginBottom: "8px",
          }}
        >
          Welcome to Promptify
        </Typography>
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "23px",
            letterSpacing: "0.4px",
            color: "#1D2028",
            marginBottom: "16px",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Unleash your creative potential using Promptify, the ultimate ChatGPT and AI-driven content generation and
          idea inspiration platform. Try it today!
        </Typography>

        <Stack
          direction={"row"}
          gap={"8px"}
        >
          <BaseButton
            sx={{
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "24px",
            }}
            variant="contained"
            color="primary"
            onClick={() => {
              router.push({
                pathname: "/signin",
                query: { from: "signup" },
              });
            }}
          >
            Sign Up for Free
          </BaseButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
