import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MessageContainer from "@/components/GPT/MessageContainer";
import { BtnStyle } from "@/components/GPT/Constants";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  message: IMessage;
  onActivate(): void;
  allowActivateButton?: boolean;
  updateMode?: boolean;
}

export default function ActivateWorkflowMessage({ message, onActivate, updateMode, allowActivateButton }: Props) {
  const { fromUser, isHighlight } = message;

  return (
    <MessageContainer message={message}>
      {!updateMode && message.text && (
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
      )}
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
          Ready to {updateMode ? "update" : "turn on"} this GPT?
        </Typography>
        <Button
          onClick={onActivate}
          variant="contained"
          disabled={!allowActivateButton}
          sx={BtnStyle}
        >
          {updateMode ? "Update Activation" : "Activate"}
        </Button>
      </Stack>
    </MessageContainer>
  );
}
