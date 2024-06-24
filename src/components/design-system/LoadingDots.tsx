import { styled, keyframes } from "@mui/material/styles";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import { theme } from "@/theme";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const Dot = styled(Box)(({ delay, theme }: { delay: string; theme: Theme }) => ({
  display: "inline-block",
  width: "6px",
  height: "6px",
  margin: "0 2px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "50%",
  animation: `${bounce} 1.4s infinite ease-in-out both`,
  animationDelay: delay,
}));

function LoadingDots() {
  return (
    <Box
      component={"p"}
      sx={{
        display: "inline-block",
        margin: 0,
      }}
    >
      <Dot
        delay="0s"
        theme={theme}
        component={"p"}
      />
      <Dot
        delay="0.2s"
        theme={theme}
        component={"p"}
      />
      <Dot
        delay="0.4s"
        theme={theme}
        component={"p"}
      />
    </Box>
  );
}

export default LoadingDots;
