import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MessageSender from "@/components/Prompt/Common/Chat/MessageSender";
import { fadeIn } from "@/theme/animations";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  isValidating: boolean;
  isFadeIn?: boolean;
}
const ChatInput = ({ onSubmit, disabled, isValidating, isFadeIn }: ChatInputProps) => {
  return (
    <Grid
      position={"relative"}
      display={"flex"}
      width={"100%"}
      flexDirection={"column"}
      gap={"8px"}
      sx={{
        p: { xs: "8px 8px 20px", md: 0 },
        opacity: isFadeIn ? 0 : 1,
        animation: isFadeIn ? `${fadeIn} 0.5s ease-in 1.6s forwards` : "none",
      }}
    >
      {isValidating && (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
        >
          <CircularProgress
            size={"24px"}
            color="primary"
          />
          <Stack
            direction={"row"}
            gap={1}
          >
            <Typography
              fontSize={12}
              fontWeight={400}
              color={"onSurface"}
            >
              Promptify Thinking...
            </Typography>
          </Stack>
        </Stack>
      )}

      <Stack
        direction={"row"}
        gap={"8px"}
        alignItems={"center"}
      >
        <Box flex={1}>
          <MessageSender
            onSubmit={onSubmit}
            disabled={disabled}
          />
        </Box>
      </Stack>
      <Typography
        fontSize={12}
        fontWeight={400}
        lineHeight={"140%"}
        letterSpacing={0.17}
        textAlign={"center"}
        sx={{
          opacity: 0.45,
          display: { xs: "none", md: "block" },
        }}
      >
        Promptify uses various LLM models to achieve better results. Promptify may be wrong and can make mistakes, just
        double-check the information received from the chat. Check our{" "}
        <a
          href="https://staging.d3gvg02vbse3to.amplifyapp.com/terms-of-use"
          target="_blank"
          style={{ color: "inherit" }}
        >
          Terms of Use
        </a>{" "}
        and{" "}
        <a
          href="https://staging.d3gvg02vbse3to.amplifyapp.com/privacy-policy"
          target="_blank"
          style={{ color: "inherit" }}
        >
          Privacy Policy
        </a>
        .
      </Typography>
    </Grid>
  );
};

export default ChatInput;
