import type { Dispatch, SetStateAction } from "react";
import { Templates } from "@/core/api/dto/templates";
import { IMessage } from "../../Types/chat";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SigninButton from "@/components/common/buttons/SigninButton";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import { useAppSelector } from "@/hooks/useStore";
import { ChatInterface } from "@/components/Prompt/Common/Chat/ChatInterface";
import type { Link } from "@/components/Prompt/Types";

interface Props {
  isSidebarExpanded: Link | null;
  template: Templates;
  messages: IMessage[];
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
  showGenerate: boolean;
  showGenerateButton: boolean;
  generateExecutionHandler: () => void;
  isValidatingAnswer: boolean;
  abortConnection: () => void;
  validateVary: (variation: string) => void;
  disableChatInput: boolean;
  handleSignIn: () => void;
}

const ChatBoxVariantB: React.FC<Props> = ({
  isSidebarExpanded,
  messages,
  template,
  showGenerate,
  generateExecutionHandler,
  abortConnection,
  validateVary,
  isValidatingAnswer,
  disableChatInput,
  showGenerateButton,
  handleSignIn,
  setMessages,
}) => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  return (
    <Box
      width={{ md: isSidebarExpanded ? "100%" : "80%" }}
      mx={{ md: "auto" }}
      height={"100%"}
    >
      <Stack
        justifyContent={"flex-end"}
        height={"calc(100% - 20px)"}
        gap={2}
      >
        <ChatInterface
          messages={messages}
          setMessages={setMessages}
          template={template}
          showGenerate={showGenerate}
          onGenerate={generateExecutionHandler}
          onAbort={abortConnection}
          isValidating={isValidatingAnswer}
        />
        {currentUser?.id ? (
          <ChatInput
            onSubmit={validateVary}
            disabled={isValidatingAnswer || disableChatInput}
            isValidating={isValidatingAnswer}
            showGenerate={showGenerateButton}
            onGenerate={generateExecutionHandler}
          />
        ) : (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            width={{ md: "100%" }}
            p={{ md: "16px 8px 16px 16px" }}
          >
            <SigninButton onClick={handleSignIn} />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ChatBoxVariantB;
