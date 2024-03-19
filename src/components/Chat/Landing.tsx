import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import SuggestedPrompts from "@/components/Chat/SuggestedPrompts";
import { useAppSelector } from "@/hooks/useStore";
import {
  slideUpWithMargin,
  slideToWithTransform,
  fadeIn,
  slideToWithTransformAndOpacity,
  slideUpWithTop,
} from "@/theme/animations";
import { useEffect, useRef } from "react";

function Landing() {
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);
  const bottomElemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      bottomElemRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Stack
      overflow={"auto"}
      gap={4}
      sx={{
        pt: "32px",
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
          top: 0,
          mx: "auto",
          position: "relative",
          animation: `${slideUpWithTop()} 0.5s ease-in 1.6s forwards`,
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
            transform: "translateX(20%)",
            animation: `${slideToWithTransform({
              from: "translateX(20%)",
              to: "translateX(-95%)",
            })} 0.5s ease-in 1.1s forwards`,
          }}
        >
          <Image
            src={require("@/pages/chat/images/image_1.png")}
            alt={"left"}
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
            src={require("@/pages/chat/images/image_2.png")}
            alt={"middle"}
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
            zIndex: 2,
            width: { xs: "70px", md: "150px" },
            height: { xs: "120px", md: "293px" },
            borderRadius: "140px",
            overflow: "hidden",
            right: { xs: 60, md: 20 },
            transform: "translateX(-20%)",
            animation: `${slideToWithTransform({
              from: "translateX(-20%)",
              to: "translateX(95%)",
            })} 0.5s ease-in 1.1s forwards`,
          }}
        >
          <Image
            src={require("@/pages/chat/images/image_3.png")}
            alt={"right"}
            priority={true}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
      </Stack>
      <Stack
        sx={{
          animation: `${slideUpWithMargin()} 0.5s ease-in 1.6s forwards`,
          gap: 3,
          mt: 0,
          textAlign: "center",
          mb: "40px",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "30px", md: "48px" },
            opacity: 0,
            fontWeight: 300,
            lineHeight: "57.6px",
            letterSpacing: "0.17px",
            animation: `${fadeIn} 0.5s ease-in 1s forwards`,
          }}
        >
          Let’s start new chat!
        </Typography>
        <Typography
          sx={{
            opacity: 0,
            animation: `${slideToWithTransformAndOpacity} 0.5s ease-in 1.6s forwards`,
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: "400",
            lineHeight: "25.6px",
          }}
        >
          I can help you with your requests like any other AI, moreover I can run different models, also, you can look
          at my pre-designed prompts for different cases!
        </Typography>
      </Stack>
      <SuggestedPrompts />
      <div ref={bottomElemRef} />
    </Stack>
  );
}

export default Landing;
