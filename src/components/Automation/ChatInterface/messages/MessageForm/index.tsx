import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import FormInput from "@/components/Automation/ChatInterface/messages/MessageForm/FormInput";
import MessageContainer from "@/components/Automation/ChatInterface/messages/MessageContainer";

import type { IAnswer } from "@/components/Prompt/Types/chat";
import type { IMessage } from "@/components/Automation/ChatInterface/types";

interface Props {
  message?: IMessage;
  answers?: IAnswer[];
  disabled?: boolean;
}

function MessageForm({ message, answers = [], disabled }: Props) {
  const inputs = useAppSelector(state => state.chat?.inputs ?? initialChatState.inputs);

  return (
    <MessageContainer message={message}>
      {message?.text && (
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"onSurface"}
          sx={{
            p: "16px 20px",
            borderRadius: message?.fromUser ? "100px 100px 100px 0px" : "0px 100px 100px 100px",
            bgcolor: message?.isHighlight ? "#DFDAFF" : "#F8F7FF",
          }}
        >
          {message.text}
        </Typography>
      )}
      <Stack
        fontSize={14}
        fontWeight={500}
        gap={3}
        alignItems={"start"}
        color={"onSurface"}
        sx={{
          p: "26px",
          borderRadius: "0px 24px 24px 24px",
          bgcolor: "#F8F7FF",
        }}
      >
        <Stack
          bgcolor={"#3C3359"}
          minWidth={{ md: "560px" }}
          borderRadius={"8px"}
          gap={"8px"}
          width={{ md: "98%" }}
          padding={"8px"}
        >
          <Typography
            color={"#fff"}
            letterSpacing={"0.06px"}
            fontSize={10}
            lineHeight={"100%"}
            textTransform={"uppercase"}
            fontWeight={600}
          >
            WORKFLOW Information
          </Typography>
          {inputs.map(input => {
            const value = answers.find(answer => answer.inputName === input.name);
            return (
              <FormInput
                key={input.name}
                input={input}
                answer={value}
                disabled={disabled}
              />
            );
          })}
        </Stack>
      </Stack>
    </MessageContainer>
  );
}

export default MessageForm;
