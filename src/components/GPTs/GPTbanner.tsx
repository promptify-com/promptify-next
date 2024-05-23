import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import React from "react";
import GmailSvg from "./Icons/GmailSvg";
import Link from "next/link";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  title: string;
  description: string;
  href: string;
}

function GPTbanner({ title, description, href }: Props) {
  const { isMobile } = useBrowser();
  return (
    <Stack
      width={"100%"}
      height={{ md: "260px" }}
      sx={{
        background:
          "linear-gradient(0deg, #EEE8FF 0%, #EEE8FF 100%), url(<path-to-image>) lightgray 50% / cover no-repeat",
        borderRadius: "16px",
      }}
      direction={{ md: "row" }}
      alignItems={{ md: "center" }}
      justifyContent={"space-between"}
      position={"relative"}
      overflow={"hidden"}
      p={{ xs: "24px", md: 0 }}
      gap={"17px"}
    >
      <Stack
        p={{ md: "143px 0px 34px 32px" }}
        gap={"8px"}
      >
        <Typography
          fontSize={48}
          fontWeight={"500"}
          lineHeight={"120%"}
        >
          {title}
        </Typography>
        <Typography
          fontSize={11}
          fontWeight={"400"}
          lineHeight={"150%"}
        >
          {description}
        </Typography>
      </Stack>
      <Stack
        gap={"48px"}
        alignItems={"end"}
        direction={"row"}
        pr={"24px"}
      >
        <Stack
          position={{ xs: "absolute", md: "relative" }}
          bottom={-1}
          right={"-10px"}
          zIndex={4444}
        >
          <GmailSvg
            width={isMobile ? "140" : "265"}
            height={isMobile ? "130" : "193"}
          />
        </Stack>
        <Link href={href}>
          <Stack
            width={"40px"}
            height={"40px"}
            borderRadius={"40px"}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            bgcolor={"#6E45E9"}
          >
            <KeyboardArrowRightRounded sx={{ color: "white" }} />
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
}

export default GPTbanner;
