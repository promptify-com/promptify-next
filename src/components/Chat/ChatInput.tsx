import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { ProgressLogo } from "@/components/common/ProgressLogo";
import MessageSender from "../Prompt/Common/Chat/MessageSender";

interface ChatInputProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  isValidating: boolean;
  onGenerate: () => void;
  showGenerate: boolean;
}
const ChatInput = ({ onSubmit, disabled, isValidating, onGenerate, showGenerate }: ChatInputProps) => {
  return (
    <Grid
      position={"relative"}
      display={"flex"}
      width={"100%"}
      flexDirection={"column"}
      gap={"8px"}
    >
      {isValidating && (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
        >
          <ProgressLogo size="small" />
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
            mode={"chat"}
            onGenerate={onGenerate}
            showGenerate={showGenerate}
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
        }}
      >
        Promptify uses various LLM models to achieve better results. Promptify may be wrong and can make mistakes, just
        double-check the information received from the chat. Check our Terms of Use and Privacy Policy.
      </Typography>
    </Grid>
  );
};

export default ChatInput;
