import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "@/hooks/useStore";
import { initialState } from "@/core/store/chatSlice";
import FormInput from "@/components/GPT/FormInput";
import MessageContainer from "@/components/GPT/MessageContainer";
import type { IMessage } from "@/components/Prompt/Types/chat";
import RunButton from "@/components/GPT/RunButton";

interface Props {
  message: IMessage;
  allowGenerate: boolean;
  onGenerate: () => void;
  isExecuting?: boolean;
}

function MessageInputs({ message, onGenerate, allowGenerate, isExecuting }: Props) {
  const inputs = useAppSelector(state => state.chat?.inputs ?? initialState.inputs);
  return (
    <MessageContainer message={message}>
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
          {inputs.map(input => (
            <FormInput
              key={input.name}
              input={input}
            />
          ))}
        </Stack>
        {allowGenerate && (
          <RunButton
            loading={isExecuting}
            onClick={onGenerate}
          />
        )}
      </Stack>
    </MessageContainer>
  );
}

export default MessageInputs;
