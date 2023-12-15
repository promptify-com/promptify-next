import { Fragment, useEffect, useRef, useState } from "react";
import { Box, Divider, Stack } from "@mui/material";
import { Templates, TemplatesWithPagination } from "@/core/api/dto/templates";
import { Layout } from "@/layout";
import { authClient } from "@/common/axios";
import { theme } from "@/theme";
import { getCurrentDateFormatted } from "@/common/helpers/timeManipulation";
import { IMessage } from "@/common/types/chat";
import { randomId } from "@/common/helpers";
import { useAppSelector } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import { TemplatesList } from "@/components/chat/TemplatesList";
import { Message } from "@/components/Prompt/Common/Chat/Message";
import { ChatInput } from "@/components/chat/ChatInput";

interface Props {
  initTemplates: Templates[];
}

function Template({ initTemplates }: Props) {
  const [templates, setTemplates] = useState(initTemplates);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const isSimulationStreaming = useAppSelector(state => state.chat.isSimulationStreaming);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  const addToQueuedMessages = (messages: IMessage[]) => {
    setQueuedMessages(messages);
    dispatch(setIsSimulationStreaming(true));
  };

  useEffect(() => {
    if (!isSimulationStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.pop()!;

      const updatedMessages = messages.concat(nextQueuedMessage);
      setMessages(updatedMessages);

      addToQueuedMessages(queuedMessages);
    }
  }, [isSimulationStreaming]);

  useEffect(() => {
    initMessages();
  }, []);

  const initMessages = () => {
    const welcomeMessage: IMessage[] = [];
    const createdAt = new Date();

    welcomeMessage.push({
      id: randomId(),
      text: "Here is a list of suggested template that you can use to get the best recommendations",
      type: "text",
      createdAt: createdAt,
    });

    addToQueuedMessages([
      {
        id: randomId(),
        text: "",
        createdAt: createdAt,
        type: "templates",
        templates: templates,
        templatesTitle: "Suggested Templates",
      },
    ]);

    setMessages(welcomeMessage);
  };

  useEffect(() => scrollToBottom(), [messages]);

  const scrollToBottom = () => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const submitAnswer = async (answer: string) => {
    if (answer) {
      const userMessage: IMessage = {
        id: randomId(),
        text: answer,
        type: "text",
        createdAt: new Date(),
        fromUser: true,
      };

      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "templates").concat(userMessage));

      setIsValidatingAnswer(true);

      const limit = Math.floor(Math.random() * 10);

      const createdAt = new Date();

      const message: IMessage = {
        id: randomId(),
        text: "Here is a list of suggested template that you can use to get the best recommendations",
        type: "text",
        createdAt: createdAt,
      };

      try {
        if (limit === 0) throw Error("no limit");

        const templatesRes = (await authClient.get(`/api/meta/templates/?limit=${limit}`))
          .data as TemplatesWithPagination;
        const _templates = templatesRes.results;

        setIsValidatingAnswer(false);

        addToQueuedMessages([
          {
            id: randomId(),
            text: "",
            createdAt: createdAt,
            type: "templates",
            templates: _templates,
            templatesTitle: "Suggested Templates",
          },
        ]);
      } catch (err) {
        setIsValidatingAnswer(false);
        message.text = "Oops! I couldn't get your request, Please try again.";
      }

      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== "templates").concat(message));
    }
  };

  return (
    <Layout>
      <Box
        height={{
          xs: `calc(100svh - ${theme.custom.headerHeight.xs})`,
          md: `calc(100svh - ${theme.custom.headerHeight.md})`,
        }}
        sx={{
          width: { md: "70%" },
          m: "auto",
          mt: { xs: "58px", md: 0 },
        }}
      >
        <Box
          ref={messagesContainerRef}
          height={`calc(100% - ${isValidatingAnswer ? "108" : "74"}px)`}
          sx={{
            px: { xs: "8px", md: "1px" },
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(137, 130, 130, 0.33)",
              borderRadius: "10px",
            },
          }}
        >
          <Divider
            sx={{
              fontSize: 12,
              fontWeight: 400,
              color: "onSurface",
              opacity: 0.5,
              py: "20px",
            }}
          >
            {getCurrentDateFormatted()}
          </Divider>
          <Stack
            gap={6}
            pb={"15px"}
          >
            {messages.map(msg => (
              <Fragment key={msg.id}>
                <Message
                  message={msg}
                  onScrollToBottom={scrollToBottom}
                  isExecutionMode={false}
                />

                {msg.type === "templates" && msg.templates && (
                  <TemplatesList
                    templates={msg.templates}
                    title={msg.templatesTitle}
                  />
                )}
              </Fragment>
            ))}
          </Stack>
        </Box>
        <ChatInput
          isValidating={isValidatingAnswer}
          onSubmit={submitAnswer}
        />
      </Box>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const templatesRes = await authClient.get("/api/meta/templates/?limit=10");
    const initTemplates = templatesRes.data.results as Templates;

    return {
      props: {
        title: "Chat | Promptify",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        initTemplates,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        initTemplates: [],
      },
    };
  }
}

export default Template;
