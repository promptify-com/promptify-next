import Typography from "@mui/material/Typography";
import type { IMessage } from "@/components/Prompt/Types/chat";
import MessageContainer from "./MessageContainer";

interface Props {
  message: IMessage;
}

export default function Message({ message }: Props) {
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
    </MessageContainer>
  );
}
