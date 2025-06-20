import { Fragment, useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import { useAppSelector } from "@/hooks/useStore";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import ChatOptions from "@/components/Chat/ChatOptions";
import ChatHeading from "@/components/Chat/ChatHeading";
import RenderMessage from "@/components/Chat/RenderMessage";
import RunButton from "@/components/Chat/RunButton";
import ScrollDownButton from "@/components/common/buttons/ScrollDownButton";
import type { IMessage } from "@/components/Prompt/Types/chat";
import { initialState as initialChatState } from "@/core/store/chatSlice";
import IconButton from "@mui/material/IconButton";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface Props {
  messages: IMessage[];
  onGenerate: () => void;
  onExecuteWorkflow?: () => void;
  showGenerateButton: boolean;
  onAbort: () => void;
  fetchMoreMessages: () => void;
  loadingMessages: boolean;
  stopScrollingToBottom: boolean;
}

const ChatInterface = ({
  messages,
  onGenerate,
  showGenerateButton,
  onAbort,
  fetchMoreMessages,
  loadingMessages,
  stopScrollingToBottom,
  onExecuteWorkflow,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    selectedTemplate,
    selectedChatOption = null,
    selectedChat,
  } = useAppSelector(state => state.chat ?? initialChatState);
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);
  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { scrollToBottom, showScrollDown } = useScrollToBottom({
    ref: messagesContainerRef,
    content: messages,
    skipScroll: stopScrollingToBottom,
  });

  const [isUserScrollingUp, setIsUserScrollingUp] = useState(false);

  useEffect(() => {
    const chatContainer = messagesContainerRef.current;

    const handleScroll = () => {
      if (chatContainer) {
        if (chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.clientHeight) {
          setIsUserScrollingUp(true);
        } else {
          setIsUserScrollingUp(false);
        }
      }
    };

    chatContainer?.addEventListener("scroll", handleScroll);

    return () => {
      chatContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current?.scrollTop === 0) {
        fetchMoreMessages();
      }
    };

    const currentRef = messagesContainerRef.current;
    currentRef?.addEventListener("scroll", handleScroll);

    return () => currentRef?.removeEventListener("scroll", handleScroll);
  }, [fetchMoreMessages]);

  const showChatOptions = Boolean(selectedTemplate && !currentUser?.preferences?.input_style && !selectedChatOption);
  const showRunButton =
    showGenerateButton && (currentUser?.preferences?.input_style === "qa" || selectedChatOption === "qa");

  return (
    <Stack
      ref={messagesContainerRef}
      gap={3}
      position={"relative"}
      sx={{
        p: {
          xs: "48px 4px",
          md: isChatHistorySticky ? "40px 80px" : "40px 300px",
        },
        overflowY: "auto",
        overflowX: "hidden",
        overscrollBehavior: "contain",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          width: "0px",
        },
      }}
    >
      {showScrollDown && isGenerating && <ScrollDownButton onClick={scrollToBottom} />}
      <Stack
        direction={"column"}
        gap={3}
        position={"relative"}
      >
        {!!selectedChat && (
          <ChatHeading
            title={selectedChat.title !== "Welcome" ? selectedChat.title : messages[0].text ?? "Welcome"}
            thumbnail={selectedChat.thumbnail}
          />
        )}

        {loadingMessages && (
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              position: "absolute",
              top: "140px",
              left: "50%",
              transform: "translate(30%, -50%)",
              zIndex: 2,
            }}
          >
            <CircularProgress size={30} />
          </Stack>
        )}

        <Stack
          direction={"column"}
          gap={3}
        >
          {messages.map(msg => (
            <Fragment key={msg.id}>
              <RenderMessage
                message={msg}
                onScrollToBottom={scrollToBottom}
                onGenerate={onGenerate}
                onAbort={onAbort}
                onExecuteWorkflow={onExecuteWorkflow}
                lastMessage={messages[messages.length - 1]}
                isUserScrollingUp={isUserScrollingUp}
              />
            </Fragment>
          ))}

          {showChatOptions && <ChatOptions />}

          {isUserScrollingUp && (
            <IconButton
              onClick={() => {
                scrollToBottom();
                setIsUserScrollingUp(false);
              }}
              sx={{
                position: "fixed",
                bottom: 150,
                right: 40,
              }}
            >
              <ArrowDownwardIcon />
            </IconButton>
          )}
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"start"}
        >
          {showRunButton && (
            <RunButton
              onClick={() => {
                if (typeof onGenerate === "function") {
                  onGenerate();
                }
              }}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChatInterface;
