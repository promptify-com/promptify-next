import { Fragment, useEffect, useRef, useState } from "react";
import { isBrowser, randomId } from "@/common/helpers";
import { setIsSimulationStreaming, setUserChatted } from "@/core/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { Layout } from "@/layout";
import { theme } from "@/theme";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { getCurrentDateFormatted } from "@/common/helpers/timeManipulation";
import Storage from "@/common/storage";
import { n8nClient as ApiClient } from "@/common/axios";
import { Templates } from "@/core/api/dto/templates";
import CardTemplate from "@/components/common/cards/CardTemplate";
import Typography from "@mui/material/Typography";
import { ListOutlined } from "@mui/icons-material";
import Landing from "@/components/Landing";
import { IMessage } from "@/components/Prompt/Types/chat";
import { getTemplateById } from "@/hooks/api/templates";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import { TemplateDetailsCard } from "@/components/Prompt/Common/TemplateDetailsCard";
import { Message } from "@/components/Prompt/Common/Chat/Message";

const N8N_SESSION_ID = "n8nSessionId";
const N8N_SAVED_TEMPLATES = "n8nSavedTemplates";
const N8N_SAVED_TEMPLATES_REFS = "n8nSavedTemplatesRefs";

type MessageType = "loadSession" | "sendMessage";
interface LoadPreviousSessionItem {
  id: string[];
  kwargs: {
    content: string;
    additional_kwargs: Record<string, unknown>;
  };
  lc: number;
  type: string;
}
interface LoadPreviousSessionResponseItem {
  data: LoadPreviousSessionItem[];
}
interface SendMessageResponse {
  output?: string;
  message?: string;
}

async function loadPreviousSessionAPI(sessionId: number): Promise<LoadPreviousSessionResponseItem> {
  const response = await ApiClient.post(`/webhook/${process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_PATH}`, {
    action: "loadPreviousSession",
    sessionId: String(sessionId),
  });

  return response.data;
}

async function sendMessageAPI(message: string, sessionId: number): Promise<SendMessageResponse> {
  const response = await ApiClient.post(`/webhook/${process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_PATH}`, {
    action: "sendMessage",
    sessionId: String(sessionId),
    message: `${message}`,
  });

  return response.data;
}

async function fetchTempates(ids: number[]) {
  if (!ids.length) {
    return [];
  }

  let savedTemplates = Storage.get(N8N_SAVED_TEMPLATES) as Record<number, Templates>;
  let savedTemplatesRefs = Storage.get(N8N_SAVED_TEMPLATES_REFS) as Record<string, number[]>;
  const templatesKey = ids.join("_");

  if (!savedTemplates) {
    savedTemplates = {};
    savedTemplatesRefs = {};
  }

  if (savedTemplatesRefs[templatesKey]) {
    return ids.map(id => savedTemplates[id]);
  }

  const templates = await Promise.allSettled(
    ids.map(id => {
      // we don't need to trigger a request as we already have this template stored
      if (savedTemplates[id]) {
        return savedTemplates[id];
      }

      return getTemplateById(id);
    }),
  );
  const filteredTemplates = templates
    .map(template => {
      if (template.status === "fulfilled") {
        return template.value;
      }
    })
    .filter(tpl => tpl?.id) as Templates[];

  if (!!filteredTemplates.length) {
    const collectedIds: number[] = [];
    // only save necessary data for templates to be shown
    savedTemplates = filteredTemplates.reduce((_templates, template) => {
      collectedIds.push(template.id);

      if (!_templates[template.id]) {
        _templates[template.id] = {
          id: template.id,
          slug: template.slug,
          thumbnail: template.thumbnail,
          title: template.title,
          tags: template.tags,
          favorites_count: template.favorites_count,
        } as Templates;
      }

      return _templates;
    }, savedTemplates);
    savedTemplatesRefs[templatesKey] = collectedIds;

    Storage.set(N8N_SAVED_TEMPLATES_REFS, JSON.stringify(savedTemplatesRefs));
    Storage.set(N8N_SAVED_TEMPLATES, JSON.stringify(savedTemplates));
  }

  return filteredTemplates;
}

function extractTemplateIDs(message: string) {
  const tplIds =
    message
      .match(/(template id|template)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)?/gi)
      ?.map(tpl => +tpl.replace(/[^\d]+/, ""))
      .filter(Boolean) ?? [];
  const tplIds2 =
    message.match(/ids[\s*\w]+are[\s*\d\,]+/gi)?.flatMap(s => {
      const repl = s.replace(/[^\d]/g, "#");
      return repl.split("#").filter(Boolean);
    }) ?? [];
  const mergedIds = new Set([...tplIds, ...tplIds2]);

  return Array.from(mergedIds)?.map(n => +n) ?? [];
}

function extractWorkflowIDs(message: string) {
  return (
    message
      .match(/(workflow id|workflow)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)?/gi)
      ?.map(wkf => +wkf.replace(/[^\d]+/, ""))
      .filter(Boolean) ?? []
  );
}

export default function Chat() {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const isSimulationStreaming = useAppSelector(state => state.chat.isSimulationStreaming);
  const userChatted = useAppSelector(state => state.chat.userChatted);
  const currentSessionId = useRef<number>(isBrowser() ? Storage.get(N8N_SESSION_ID) : 0);

  // useEffect(() => {
  //   initMessages();
  //   loadPreviousSession();
  // }, []);

  useEffect(() => {
    if (!isSimulationStreaming && !!queuedMessages.length) {
      const nextQueuedMessage = queuedMessages.shift()!;
      const updatedMessages = messages.concat(nextQueuedMessage);

      dispatch(setIsSimulationStreaming(true));
      setMessages(updatedMessages);
      setQueuedMessages(queuedMessages);
    }
  }, [isSimulationStreaming, queuedMessages]);

  useEffect(() => scrollToBottom(), [messages]);

  const addToQueuedMessages = (messages: IMessage[]) => {
    setTimeout(() => {
      setQueuedMessages(messages);
    }, 10);
  };
  const saveSessionId = (sessionId?: number) => {
    currentSessionId.current = sessionId || randomId();

    Storage.set(N8N_SESSION_ID, String(currentSessionId.current));
  };
  const loadPreviousSession = async () => {
    try {
      const savedSessionId = Storage.get(N8N_SESSION_ID);

      if (!savedSessionId) {
        return;
      }

      const previousMessagesResponse = await loadPreviousSessionAPI(Number(savedSessionId));

      if (!!previousMessagesResponse.data?.length) {
        for (let i = 0; i < previousMessagesResponse.data.length; i++) {
          const message = previousMessagesResponse.data[i];
          const content = message.kwargs.content;
          const ids = extractTemplateIDs(content);

          if (message.id.includes("AIMessage") && !!ids.length) {
            setIsValidatingAnswer(true);
            const templates = await fetchTempates(ids);

            if (!!templates.length) {
              setMessages(prevMessages => prevMessages.concat(templateMessages(templates, "loadSession", content)));
            }
            setIsValidatingAnswer(false);
          } else {
            setMessages(prevMessages =>
              prevMessages.concat({
                id: randomId(),
                text: content,
                createdAt: new Date().toISOString(),
                fromUser: message.id.includes("HumanMessage"),
                shouldStream: false,
                type: "text",
              }),
            );
          }
        }
      }
    } catch (error) {
      console.warn("loadPreviousSession API failed!", error);
    }
  };
  const initMessages = () => {
    setMessages([
      {
        id: randomId(),
        text: "Hi there! 👋. My name is Promptify. How can I assist you today?",
        createdAt: new Date().toISOString(),
        fromUser: false,
        type: "text",
      },
    ]);
  };
  const scrollToBottom = () => {
    const messagesContainer = messagesContainerRef.current;

    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  const submitMessage = async (input: string) => {
    if (input) {
      dispatch(setUserChatted(true));

      const userMessage: IMessage = {
        id: randomId(),
        text: input,
        createdAt: new Date().toISOString(),
        fromUser: true,
        type: "text",
      };

      setMessages(prevMessages => prevMessages.concat(userMessage));
      setIsValidatingAnswer(true);

      const botMessage: IMessage = {
        id: randomId(),
        text: "",
        createdAt: new Date().toISOString(),
        fromUser: false,
        type: "text",
      };

      try {
        if (!currentSessionId.current) {
          saveSessionId();
        }
        const sendMessageResponse = await sendMessageAPI(input, currentSessionId.current);

        if (sendMessageResponse.message) {
          botMessage.text = sendMessageResponse.message;
        } else {
          const ids = extractTemplateIDs(sendMessageResponse.output!);

          if (!!ids.length) {
            const templates = await fetchTempates(ids);
            const _templates = templateMessages(templates, "sendMessage", sendMessageResponse.output);

            if (!!_templates.length) {
              addToQueuedMessages(_templates);
            }
          } else {
            botMessage.text = sendMessageResponse.output!;
          }
        }
      } catch (err) {
        botMessage.text = "Oops! I couldn't get your request, Please try again. " + err;
      } finally {
        setIsValidatingAnswer(false);
      }

      if (botMessage.text !== "") {
        setMessages(prevMessages => prevMessages.concat(botMessage));
      }
    }
  };
  const templateMessages = (templates: Templates[], type: MessageType, preferableContent = "") => {
    const newMessages: IMessage[] = [];

    if (!!templates.length) {
      newMessages.push({
        id: randomId(),
        text: preferableContent
          .replace(/[\(]?(promptify_tpl_id|template id|are|with id)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)?[ \)]?/gi, "")
          .replace(/((\,\d+)|#\d+|([\(]?id:\s*\d+[\)]?))/gi, "")
          .trim(),
        createdAt: new Date().toISOString(),
        type: "text",
        fromUser: false,
        shouldStream: type !== "loadSession",
      });
      newMessages.push({
        id: randomId(),
        text: "",
        createdAt: new Date().toISOString(),
        type: "templates",
        templates: templates,
        fromUser: true,
      });
    } else {
      newMessages.push({
        id: randomId(),
        text: "We could not fetch templates!",
        createdAt: new Date().toISOString(),
        type: "text",
        fromUser: false,
        shouldStream: type === "loadSession",
      });
    }

    return newMessages;
  };

  return (
    <Layout>
      <Box
        height={{
          xs: `calc(100svh - ${theme.custom.headerHeight.xs})`,
          md: `calc(100svh - ${theme.custom.headerHeight.md})`,
        }}
        sx={{
          width: { md: "70%", xs: "100%" },
          minWidth: { md: "70%" },
          m: "auto",
          mt: { xs: "58px", md: 0 },
        }}
      >
        {!userChatted ? (
          <Box
            height={`calc(100% - 74px)`}
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
            <Landing />
          </Box>
        ) : (
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
            <>
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
                gap={3}
                pb={"15px"}
              >
                {messages.map(msg => (
                  <Fragment key={msg.id}>
                    <Message
                      message={msg}
                      onScrollToBottom={scrollToBottom}
                    />

                    {msg.type === "templates" && (
                      <TemplatesList
                        templates={msg.templates ?? []}
                        title={"Suggested Templates"}
                      />
                    )}
                  </Fragment>
                ))}
              </Stack>
            </>
          </Box>
        )}
        <ChatInput
          isValidating={isValidatingAnswer}
          onSubmit={submitMessage}
          disabled={isValidatingAnswer}
          disabledButton={isValidatingAnswer}
          onGenerate={() => {}}
          showGenerate={false}
          {...(messages.length > 1 && {
            onClearChat: () => {
              initMessages();
              Storage.remove(N8N_SESSION_ID);
              Storage.remove(N8N_SAVED_TEMPLATES);
              Storage.remove(N8N_SAVED_TEMPLATES_REFS);
              currentSessionId.current = 0;
            },
          })}
        />
      </Box>
    </Layout>
  );
}

export async function getStaticProps() {
  return { props: {} };
}

const TemplatesList = ({ templates, title }: { templates: Templates[]; title: string }) => {
  const singleTemplate = templates.length === 1;
  const dispatch = useAppDispatch();

  useEffect(() => {
    // at Message component, we won't make it to set streaming to false
    dispatch(setIsSimulationStreaming(false));
  }, []);

  return (
    <Box
      bgcolor={"surface.2"}
      sx={{
        borderRadius: "16px",
        borderTopLeftRadius: 0,
      }}
    >
      <Stack
        direction={"row"}
        gap={2}
        alignItems={"center"}
        sx={{
          p: "18px",
        }}
      >
        <ListOutlined />
        <Typography
          fontSize={15}
          fontWeight={600}
          color={"onSurface"}
        >
          {title || "Templates"}
        </Typography>
      </Stack>
      <Stack
        gap={2}
        sx={{
          mx: { xs: "5px", md: "40px" },
          p: "18px",
        }}
      >
        {templates.map(template =>
          singleTemplate ? (
            <TemplateDetailsCard
              key={template.id}
              template={template}
              variant="light"
              redirect
            />
          ) : (
            <CardTemplate
              key={template.id}
              template={template}
            />
          ),
        )}
      </Stack>
    </Box>
  );
};
