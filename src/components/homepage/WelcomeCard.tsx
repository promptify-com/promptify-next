import { ExploreHeaderImage } from "@/assets/icons/exploreHeader";
import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import BaseButton from "../base/BaseButton";

export const WelcomeCard = () => {
  const router = useRouter();
  return (
    <Stack
      bgcolor={"white"}
      sx={{
        padding: { xs: "16px", md: "24px" },
        borderRadius: "25px",
        gap: { xs: "25px", sm: "48px", md: "10px", lg: "48px" },
        flexDirection: { xs: "column", sm: "row" },
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
          alignItems: "center",
        }}
      >
        <ExploreHeaderImage />
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
          Unleash your creative potential using Promptify, the ultimate ChatGPT
          and AI-driven content generation and idea inspiration platform. Try it
          today!
        </Typography>

        <Stack direction={"row"} gap={"8px"}>
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
              })
            }}
          >
            Sign Up for Free
          </BaseButton>

          <BaseButton
            sx={{
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "24px",
              color: "var(--primary-main, #3B4050)",
            }}
            variant="outlined"
            color="primary"
            onClick={() =>
              router.push({
                pathname: "https://promptify.com",
              })
            }
          >
            How it Works?
          </BaseButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
