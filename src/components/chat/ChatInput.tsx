import { Box, Stack, Typography } from "@mui/material";
import MessageSender from "@/components/Prompt/Common/Chat/MessageSender";
import { ProgressLogo } from "../common/ProgressLogo";

interface Props {
  isValidating: boolean;
  onSubmit: (answer: string) => void;
}

export const ChatInput = ({ isValidating, onSubmit }: Props) => {
  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        pt: "15px",
        pb: { xs: "15px", md: "30px" },
        px: "15px",
        bgcolor: "surface.1",
      }}
    >
      <Stack
        direction={"row"}
        gap={2}
      >
        {isValidating && (
          <Stack
            direction={"row"}
            gap={2}
            alignItems={"center"}
          >
            <ProgressLogo size="small" />
            <Stack
              direction={"row"}
              gap={1}
            >
              <Typography
                fontSize={15}
                fontWeight={400}
                color={"onSurface"}
                sx={{ opacity: 0.6 }}
              >
                Promptify is thinking...
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
      <MessageSender
        onSubmit={onSubmit}
        disabled={isValidating}
      />
    </Box>
  );
};
