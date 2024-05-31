import Typography from "@mui/material/Typography";
import type { IMessage } from "@/components/Prompt/Types/chat";
import MessageContainer from "./MessageContainer";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { BtnStyle } from "./Constants";

interface Props {
  message: IMessage;
  onActivate(): void;
}

export default function ActivateWorkflowMessage({ message, onActivate }: Props) {
  const { fromUser, isHighlight } = message;

  return (
    <MessageContainer message={message}>
      <Typography
        fontSize={14}
        fontWeight={500}
        color={"onSurface"}
        sx={{
          p: "16px 20px",
          borderRadius: fromUser ? "100px 100px 100px 0px" : "0px 100px 100px 100px",
          bgcolor: isHighlight ? "#DFDAFF" : "#F8F7FF",
        }}
      >
        {message.text}
      </Typography>
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        gap={3}
        sx={{
          p: "40px 20px",
          borderRadius: "0px 24px 24px 24px",
          bgcolor: "#F8F7FF",
        }}
      >
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"common.black"}
        >
          Ready to turn on this GPT?
        </Typography>
        <Button
          onClick={onActivate}
          variant="contained"
          sx={BtnStyle}
        >
          Activate
        </Button>
      </Stack>
    </MessageContainer>
  );
}
