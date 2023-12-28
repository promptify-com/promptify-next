import { Fragment, useEffect, useRef, useState } from "react";
import { isBrowser, randomId, redirectToPath } from "@/common/helpers";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
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
import { getTemplateById, getWorkflowById } from "@/hooks/api/templates";
import { ChatInput } from "@/components/Prompt/Common/Chat/ChatInput";
import { TemplateDetailsCard } from "@/components/Prompt/Common/TemplateDetailsCard";
import { Message } from "@/components/Prompt/Common/Chat/Message";
import type { IWorkflow, INode } from "@/components/Prompt/Types/chat";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Image from "@/components/design-system/Image";
import { addSpaceBetweenCapitalized } from "@/common/helpers";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material";
import useTruncate from "@/hooks/useTruncate";
import { useRouter } from "next/router";

const UNWANTED_TYPES = [
  "n8n-nodes-base.switch",
  "n8n-nodes-base.set",
  "merge",
  "n8n-nodes-base.manualTrigger",
  "n8n-nodes-base.respondToWebhook",
  "n8n-nodes-base.code",
];
const textMapping: Record<string, string> = {
  textSplitterRecursiveCharacterTextSplitter: "recursiveCharacterTextSplitter",
};

export function getNodeNames(nodes: INode[] = [], slice = 3) {
  if (!nodes[0].type) {
    return nodes;
  }

  const types = nodes
    .filter(node => !UNWANTED_TYPES.includes(node.type))
    .map(node => {
      if (!node.type) return undefined;

      return node.type.split(".")[1] ?? "";
    })
    .filter(Boolean) as string[];
  const filteredTypes = Array.from(
    new Set(
      types.map(type => {
        if (textMapping[type]) {
          return addSpaceBetweenCapitalized(textMapping[type]);
        }

        return addSpaceBetweenCapitalized(type);
      }),
    ),
  );

  return filteredTypes.slice(0, slice);
}

const N8N_SESSION_ID = "n8nSessionId";
const N8N_SAVED_TEMPLATES = "n8nSavedTemplates";
const N8N_SAVED_TEMPLATES_REFS = "n8nSavedTemplatesRefs";
const N8N_SAVED_WORKFLOWS = "n8nSavedWorkflows";
const N8N_SAVED_WORKFLOWS_REFS = "n8nSavedWorkflowsRefs";

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

async function fetchData(ids: number[], isTemplate: boolean) {
  if (!ids.length) {
    return [];
  }

  const dataKey = isTemplate ? N8N_SAVED_TEMPLATES : N8N_SAVED_WORKFLOWS;
  const dataRefKey = isTemplate ? N8N_SAVED_TEMPLATES_REFS : N8N_SAVED_WORKFLOWS_REFS;
  let savedData = Storage.get(dataKey) as Record<number, IWorkflow | Templates>;
  let savedDataRefs = Storage.get(dataRefKey) as Record<string, number[]>;
  const idsKey = ids.join("_");

  if (!savedData) {
    savedData = {};
    savedDataRefs = {};
  }

  if (savedDataRefs[idsKey]) {
    return ids.map(id => savedData[id]);
  }

  const data = await Promise.allSettled(
    ids.map(id => {
      // we don't need to trigger a request as we already have this template stored
      if (savedData[id]) {
        return savedData[id];
      }

      return isTemplate ? getTemplateById(id) : getWorkflowById(id);
    }),
  );

  const filteredData = data
    .map(_data => {
      if (_data.status === "fulfilled") {
        return _data.value;
      }
    })
    .filter(_data => _data?.id) as IWorkflow[] | Templates[];

  if (!!filteredData.length) {
    const collectedIds: number[] = [];
    // only save necessary data to be shown
    filteredData.forEach((_data, idx) => {
      collectedIds.push(_data.id);

      if (!savedData[_data.id]) {
        if (isTemplates(filteredData)) {
          const __data = _data as Templates;
          savedData[_data.id] = {
            id: __data.id,
            slug: __data.slug,
            thumbnail: __data.thumbnail,
            title: __data.title,
            tags: __data.tags,
            favorites_count: __data.favorites_count,
          } as Templates;
          filteredData[idx] = savedData[_data.id] as Templates;
        } else {
          const __data = _data as IWorkflow;
          savedData[_data.id] = {
            id: __data.id,
            name: __data.name,
            image: __data.image,
            description: __data.description,
            data: { nodes: getNodeNames(__data.data.nodes ?? [], 5) as unknown as INode[] },
            created_by: __data.created_by,
          } as IWorkflow;
          filteredData[idx] = savedData[_data.id] as IWorkflow;
        }
      }
    });

    savedDataRefs[idsKey] = collectedIds;

    Storage.set(dataRefKey, JSON.stringify(savedDataRefs));
    Storage.set(dataKey, JSON.stringify(savedData));
  }

  return filteredData;
}

function extractTemplateIDs(message: string) {
  const tplIds =
    message
      .match(/(template([\_\s*]?id)?|promptify_tpl_id)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)/gi)
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
      .match(/(workflow([\_\s*]*?id)?)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)/gi)
      ?.map(wkf => +wkf.replace(/[^\d]+/, ""))
      .filter(Boolean) ?? []
  );
}

function isTemplates(data: Templates[] | IWorkflow[]): data is Templates[] {
  if (!data.length) return false;

  return "favorites_count" in data[0];
}

export default function Chat() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isValidatingAnswer, setIsValidatingAnswer] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [queuedMessages, setQueuedMessages] = useState<IMessage[]>([]);
  const isSimulationStreaming = useAppSelector(state => state.chat.isSimulationStreaming);
  const currentSessionId = useRef<number>(isBrowser() ? Storage.get(N8N_SESSION_ID) : 0);

  // useEffect(() => {
  //   // initMessages();
  //   // loadPreviousSession();
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
  useEffect(() => {
    const searchQuery = router.query.q as string;

    if (searchQuery?.length > 2) {
      submitMessage(`Search: ${router.query.q as string}`);
    }
  }, [router]);

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

          if (message.id.includes("HumanMessage")) {
            setMessages(prevMessages =>
              prevMessages.concat({
                id: randomId(),
                text: content,
                createdAt: new Date().toISOString(),
                fromUser: true,
                shouldStream: false,
                type: "text",
              }),
            );
          } else {
            const templateIDs = extractTemplateIDs(content);
            const workflowIDs = extractWorkflowIDs(content);
            let _templates: IMessage[] = [];

            if (!!templateIDs.length) {
              setIsValidatingAnswer(true);
              const templates = (await fetchData(templateIDs, true)) as Templates[];

              if (!!templates.length) {
                _templates = dataMessages(templates, "loadSession", content);
                setMessages(prevMessages => prevMessages.concat(_templates));
              }
              setIsValidatingAnswer(false);
            }

            if (!!workflowIDs.length) {
              setIsValidatingAnswer(true);
              const workflows = (await fetchData(workflowIDs, false)) as IWorkflow[];

              if (!!workflows.length) {
                const _workflows = dataMessages(workflows, "loadSession", content);

                if (
                  (!!_templates.length && _workflows.length > 1) ||
                  (_templates.length === 1 && _workflows.length === 1)
                ) {
                  _workflows.shift(); // we should avoid displaying this content's message twice
                }

                if (!!_workflows.length) {
                  setMessages(prevMessages => prevMessages.concat(_workflows));
                }
              }
              setIsValidatingAnswer(false);
            }
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
          const templateIDs = extractTemplateIDs(sendMessageResponse.output!);
          const workflowIDs = extractWorkflowIDs(sendMessageResponse.output!);

          if (!templateIDs.length && !workflowIDs.length) {
            botMessage.text = sendMessageResponse.output!;
          } else {
            let _templates: IMessage[] = [];
            const waitingMessages: IMessage[] = [];

            if (!!templateIDs.length) {
              const templates = (await fetchData(templateIDs, true)) as Templates[];

              if (!!templates.length) {
                _templates = dataMessages(templates, "sendMessage", sendMessageResponse.output);

                waitingMessages.push(..._templates);
              }
            }

            if (!!workflowIDs.length) {
              const workflows = (await fetchData(workflowIDs, false)) as IWorkflow[];

              if (!!workflows.length) {
                const _workflows = dataMessages(workflows, "sendMessage", sendMessageResponse.output);

                if (
                  (!!_templates.length && _workflows.length > 1) ||
                  (_templates.length === 1 && _workflows.length === 1)
                ) {
                  _workflows.shift(); // we should avoid displaying this content's message twice
                }

                if (!!_workflows.length) {
                  waitingMessages.push(..._workflows);
                }
              }
            }

            if (!!waitingMessages.length) addToQueuedMessages(waitingMessages);
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
  const dataMessages = (data: Templates[] | IWorkflow[], type: MessageType, preferableContent = "") => {
    const newMessages: IMessage[] = [];

    if (!!data.length) {
      newMessages.push({
        id: randomId(),
        text: preferableContent
          .replace(
            /[\(]?(promptify_tpl_id|template([\_\s*]?id)?|with id|workflow([\_\s*]?id)?)(\W+)?:?(\s*[^\d]\s*(\d+)|\d+)[ \)]?/gi,
            "",
          )
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
        type: isTemplates(data) ? "templates" : "workflows",
        data,
        fromUser: true,
      });
    } else {
      newMessages.push({
        id: randomId(),
        text: `We could not fetch ${isTemplates(data) ? "templates" : "workflows"}!`,
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
            <Box
              sx={{
                px: { xs: "8px", md: "1px" },
                overflow: "auto",
              }}
            >
              <Landing />
            </Box>
            <Divider
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color: "onSurface",
                opacity: 0.5,
                py: "20px",
                display: !!messages.length ? "block" : "none",
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

                  {["templates", "workflows"].includes(msg.type) && (
                    <SuggestionsList
                      data={msg.data ?? []}
                      title={msg.type === "templates" ? "Suggested Templates" : "Suggested Automation Templates"}
                    />
                  )}
                </Fragment>
              ))}
            </Stack>
          </>
        </Box>

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

export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Chat",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}

const SuggestionsList = ({ data, title }: { title: string; data: Templates[] | IWorkflow[] }) => {
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
          {title || "Suggested List Templates"}
        </Typography>
      </Stack>
      <Stack
        gap={2}
        sx={{
          mx: { xs: "5px", md: "40px" },
          p: "18px",
        }}
      >
        {isTemplates(data) ? <TemplatesList templates={data} /> : <WorkflowsList workflows={data} />}
      </Stack>
    </Box>
  );
};

const WorkflowsList = ({ workflows }: { workflows: IWorkflow[] }) => {
  return workflows.map(workflow => (
    <CardWorkflow
      key={workflow.id}
      workflow={workflow}
    />
  ));
};

const TemplatesList = ({ templates }: { templates: Templates[] }) => {
  const singleTemplate = templates.length === 1;

  return templates.map(template =>
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
        redirect
      />
    ),
  );
};

function CardWorkflow({ workflow }: { workflow: IWorkflow }) {
  const { truncate } = useTruncate();

  return (
    <Box onClick={() => redirectToPath(`/automation/${workflow.id}`, {}, true)}>
      <Card
        sx={{
          borderRadius: "16px",
          p: "18px",
          bgcolor: "surface.1",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        elevation={0}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
          justifyContent={"space-between"}
        >
          <Grid
            display={"flex"}
            flexDirection={"row"}
            width={{ xs: "100%", md: "auto" }}
            justifyContent={"space-between"}
            gap={"16px"}
            alignItems={"center"}
          >
            <Grid
              display={"flex"}
              alignItems={"start"}
              gap={"16px"}
            >
              <Grid marginTop={"8px"}>
                <CardMedia
                  sx={{
                    zIndex: 1,
                    borderRadius: "16px",
                    width: { sm: "149px", xs: "98px" },
                    height: { sm: "135px", xs: "73px" },
                  }}
                >
                  <Image
                    src={workflow.image ?? require("@/assets/images/default-thumbnail.jpg")}
                    alt={workflow.name}
                    style={{ borderRadius: "16%", objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </CardMedia>
              </Grid>
              <Grid
                gap={0.5}
                display={"flex"}
                flexDirection={"column"}
                sx={{
                  color: "onSurface",
                  fontWeight: 400,
                }}
              >
                <Typography fontSize={32}>{workflow.name}</Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: "19px",
                    letterSpacing: "0.15px",
                    color: alpha(theme.palette.onSurface, 0.45),
                  }}
                  title={workflow.description}
                >
                  {truncate(workflow.description || "", { length: 150 })}
                </Typography>
                <Grid
                  sx={{
                    display: "flex",
                    gap: "4px",
                    mt: "10px",
                  }}
                >
                  {((workflow.data.nodes as unknown as string[]) ?? []).map(node => (
                    <Chip
                      key={node}
                      clickable
                      size="small"
                      label={node}
                      sx={{
                        fontSize: { xs: 11 },
                        fontWeight: 400,
                        bgcolor: "surface.5",
                        color: "onSurface",
                        textTransform: "capitalize",
                      }}
                    />
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
