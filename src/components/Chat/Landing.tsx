import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import SuggestedPrompts from "@/components/Chat/SuggestedPrompts";
import { useAppSelector } from "@/hooks/useStore";
import { keyframes } from "@mui/system";

const comeFromBottom = keyframes`
  from {
    transform: translateY(50%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;
const slideToLeft = keyframes`
  0%   { transform: translateX(20%) }
  100% { transform: translateX(-95%) }
`;
const slideToRight = keyframes`
  0%   { transform: translateX(-20%) }
  100% { transform: translateX(95%) }
`;
const fadeOut = keyframes`
  0%   { opacity: 0; }
  100% { opacity: 1; }
`;
const slideUpText = keyframes`
  0%   { margin-top: 0; }
  100% { margin-top: -30px; }
`;
const slideUpImages = keyframes`
  0%   { top: 0; }
  100% { top: -40px; }
`;

function Landing() {
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);

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
          top: 0,
          mx: "auto",
          position: "relative",
          animation: `${slideUpImages} 0.5s ease-in 1.6s forwards`,
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
            animation: `${slideToLeft} 0.5s ease-in 1.1s forwards`,
          }}
        >
          <Image
            src={require("@/pages/chats/images/image_1.png")}
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
            src={require("@/pages/chats/images/image_2.png")}
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
            animation: `${slideToRight} 0.5s ease-in 1.1s forwards`,
          }}
        >
          <Image
            src={require("@/pages/chats/images/image_3.png")}
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
          animation: `${slideUpText} 0.5s ease-in 1.6s forwards`,
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
            animation: `${fadeOut} 0.5s ease-in 1s forwards`,
          }}
        >
          Let’s start new chat!
        </Typography>
        <Typography
          sx={{
            opacity: 0,
            animation: `${comeFromBottom} 0.5s ease-in 1.6s forwards`,
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
    </Stack>
  );
}

export default Landing;
