import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { keyframes } from "@mui/material";

import MessageSender from "../Prompt/Common/Chat/MessageSender";

const fadeOut = keyframes`
  0%   { opacity: 0; }
  100% { opacity: 1; }
`;

interface ChatInputProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  isValidating: boolean;
}
const ChatInput = ({ onSubmit, disabled, isValidating }: ChatInputProps) => {
  return (
    <Grid
      position={"relative"}
      display={"flex"}
      width={"100%"}
      flexDirection={"column"}
      gap={"8px"}
      px={{ xs: "8px", md: 0 }}
      pb={{ xs: "20px", md: 0 }}
      sx={{
        opacity: 0,
        animation: `${fadeOut} 0.5s ease-in 1.6s forwards`,
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
        double-check the information received from the chat. Check our Terms of Use and Privacy Policy.
      </Typography>
    </Grid>
  );
};

export default ChatInput;
