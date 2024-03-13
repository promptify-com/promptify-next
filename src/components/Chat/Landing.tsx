import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import SuggestedPrompts from "@/components/Chat/SuggestedPrompts";
import { useAppSelector } from "@/hooks/useStore";

function Landing() {
  const [showImages, setShowImages] = useState(false);
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const showImagesAndScroll = () => {
      setShowImages(true);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({
          block: "end",
          behavior: "smooth",
        });
      }, 1000);
    };

    const timer = setTimeout(showImagesAndScroll, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack
      height={"calc(100% - 48px)"}
      overflow={"auto"}
      gap={4}
      sx={{
        pt: "32px",
        pb: "16px",
        px: { xs: "8px", md: isChatHistorySticky ? "80px" : "300px" },
        position: "relative",
        "&::-webkit-scrollbar": {
          width: "0px",
        },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={1}
        width={"300px"}
        sx={{
          mt: "auto",
          mx: "auto",
          position: "relative",
          "& > *": {
            transition: "transform 1s ease",
          },
          "& > :nth-of-type(1)": {
            transform: showImages ? "translateX(-100%)" : "translateX(0)",
          },
          "& > :nth-of-type(3)": {
            transform: showImages ? "translateX(100%)" : "translateX(0)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            zIndex: 0,
            width: { xs: "70px", md: "150px" },
            height: { xs: "120px", md: "293px" },
            borderRadius: "140px",
            overflow: "hidden",
            left: { xs: 60, md: 20 },
          }}
        >
          <Image
            src={require("@/pages/chats/images/image_1.png")}
            alt={"Image 1"}
            priority={true}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: { xs: "120px", md: "200px" },
            height: { xs: "180px", md: "393px" },
            borderRadius: "140px",
            overflow: "hidden",
          }}
        >
          <Image
            src={require("@/pages/chats/images/image_2.png")}
            alt={"Image 2"}
            priority={true}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            zIndex: 0,
            width: { xs: "70px", md: "150px" },
            height: { xs: "120px", md: "293px" },
            borderRadius: "140px",
            overflow: "hidden",
            right: { xs: 60, md: 20 },
          }}
        >
          <Image
            src={require("@/pages/chats/images/image_3.png")}
            alt={"Image 3"}
            priority={true}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
      </Stack>
      <Stack
        textAlign={"center"}
        gap={4}
      >
        <Typography
          fontSize={{ xs: "30px", md: "48px" }}
          fontWeight={300}
          lineHeight={"57.6px"}
          letterSpacing={"0.17px"}
        >
          Let’s start new chat!
        </Typography>
        <Typography
          fontSize={{ xs: "14px", md: "16px" }}
          fontWeight={"400"}
          lineHeight={"25.6px"}
        >
          I can help you with your requests like any other AI, moreover I can run different models, also, you can look
          at my pre-designed prompts for different cases!
        </Typography>
      </Stack>
      <SuggestedPrompts />
      <div ref={scrollRef}></div>
    </Stack>
  );
}

export default Landing;
