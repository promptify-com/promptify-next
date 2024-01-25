import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChatInterface } from "./ChatInterface";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import SigninButton from "@/components/common/buttons/SigninButton";
import { Templates } from "@/core/api/dto/templates";
import { IMessage } from "@/components/Prompt/Types/chat";
import { useAppSelector } from "@/hooks/useStore";
import useBrowser from "@/hooks/useBrowser";
import { IPromptInput } from "@/common/types/prompt";

interface Props {
  template: Templates;
  messages: IMessage[];
  showGenerate: boolean;
  generateExecutionHandler: () => void;
  isValidatingAnswer: boolean;
  abortConnection: () => void;
  validateVary: (variation: string) => void;
  isGenerating: boolean;
  disableChatInput: boolean;
  inputs: IPromptInput[];
  handleSignIn: () => void;
}

const ChatBoxVariantA: React.FC<Props> = ({
  template,
  messages,
  showGenerate,
  generateExecutionHandler,
  isValidatingAnswer,
  abortConnection,
  validateVary,
  isGenerating,
  disableChatInput,
  inputs,
  handleSignIn,
}) => {
  const { isMobile } = useBrowser();
  const currentUser = useAppSelector(state => state.user.currentUser);

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      bgcolor={"surface.3"}
    >
      {!isMobile && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            bgcolor: "surface.1",
            p: "24px 8px 24px 28px",
          }}
        >
          <Typography
            fontSize={12}
            fontWeight={500}
            letterSpacing={2}
            textTransform={"uppercase"}
          >
            Chat With Promptify
          </Typography>
        </Stack>
      )}
      <Stack
        justifyContent={"flex-end"}
        gap={2}
        height={{
          xs: "100%",
          md: "calc(100% - 66px)",
        }}
        bgcolor={"surface.1"}
      >
        <ChatInterface
          template={template}
          messages={messages}
          showGenerate={showGenerate}
          onGenerate={generateExecutionHandler}
          isValidating={isValidatingAnswer}
          abortGenerating={abortConnection}
        />

        {currentUser?.id ? (
          <ChatInput
            onSubmit={validateVary}
            disabled={isValidatingAnswer || isGenerating || disableChatInput || inputs.length === 0}
            showGenerate={showGenerate}
            onGenerate={generateExecutionHandler}
            isValidating={isValidatingAnswer}
          />
        ) : (
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            p={"16px 8px 16px 16px"}
          >
            <SigninButton onClick={handleSignIn} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default ChatBoxVariantA;
