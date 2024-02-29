import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import SuggestedPrompts from "@/components/Chat/SuggestedPrompts";

function Landing() {
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImages(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack
      direction={"column"}
      gap={4}
      pt={"32px"}
      pb={"16px"}
      position={"relative"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        justifyContent={"center"}
        width={"300px"}
        mx={"auto"}
        sx={{
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
            width: "150px",
            height: "293px",
            borderRadius: "140px",
            overflow: "hidden",
            left: 20,
          }}
        >
          <Image
            src={require("@/pages/chats/images/image_1.png")}
            alt={"Image 1"}
            priority={true}
            fill
            sizes="(max-width: 900px) 253px, 353px"
            style={{
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "200px",
            height: "393px",
            borderRadius: "140px",
            overflow: "hidden",
          }}
        >
          <Image
            src={require("@/pages/chats/images/image_2.png")}
            alt={"Image 2"}
            priority={true}
            fill
            sizes="(max-width: 900px) 253px, 353px"
            style={{
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            zIndex: 0,
            width: "150px",
            height: "293px",
            borderRadius: "140px",
            overflow: "hidden",
            right: 20,
          }}
        >
          <Image
            src={require("@/pages/chats/images/image_3.png")}
            alt={"Image 3"}
            priority={true}
            fill
            sizes="(max-width: 900px) 253px, 353px"
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
          fontSize={"48px"}
          fontWeight={300}
          lineHeight={"57.6px"}
          letterSpacing={"0.17px"}
        >
          Let’s start new chat!
        </Typography>
        <Typography
          fontSize={"16px"}
          fontWeight={"400"}
          lineHeight={"25.6px"}
        >
          I can help you with your requests like any other AI, moreover I can run different models, also, you can look
          at my <br /> pre-designed prompts for different cases!
        </Typography>
      </Stack>
      <SuggestedPrompts />
    </Stack>
  );
}

export default Landing;
