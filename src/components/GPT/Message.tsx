import { memo, useEffect, useState, lazy, Suspense } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Done from "@mui/icons-material/Done";
import { ShareOutlined } from "@mui/icons-material";
import Replay from "@mui/icons-material/Replay";
import EditOutlined from "@mui/icons-material/EditOutlined";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { setToast } from "@/core/store/toastSlice";
import type { IMessage } from "@/components/Prompt/Types/chat";
import MessageContainer from "./MessageContainer";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { initialState as initialChatState, setIsSimulationStreaming } from "@/core/store/chatSlice";
import CustomTooltip from "@/components/Prompt/Common/CustomTooltip";
import MessageInputs from "./MessageInputs";
import { createMessage } from "../Chat/helper";
import { getWorkflowInputsValues } from "../GPTs/helpers";
import type { IWorkflowCreateResponse } from "../Automation/types";
import { ExecutionContent } from "../common/ExecutionContent";
import { ExportPopupChat } from "@/components/GPT/Chat/ExportPopupChat";
const AntThinkingComponent = lazy(() => import("@/components/GPT/AntThinking"));
const AntArtifactComponent = lazy(() => import("@/components/GPT/AntArtifact"));

interface Props {
  message: IMessage;
  isInitialMessage?: boolean;
  retryExecution?(): void;
  showInputs?(): void;
  saveAsDocument?(): Promise<boolean>;
  scrollToBottom?(): void;
}

interface MessageContentProps {
  content: string;
  shouldStream: boolean;
  onStreamingFinished?: () => void;
}

export const MessageContentWithHTML = memo(
  ({ content, scrollToBottom }: { content: string; scrollToBottom?: () => void }) => {
    const [htmlParts, setHtmlParts] = useState<React.ReactNode[]>([]);

    useEffect(() => {
      if (!content) return;

      const generateFinalHtml = async () => {
        // Split by <antThinking> and <antArtifact> tags, including closing tags
        const parts = content.split(/(<antThinking>|<\/antThinking>|<antArtifact|<\/antArtifact>)/g);
        const renderedComponents: React.ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i]?.trim();

          if (part === "<antThinking>") {
            let thinkingContent = "";
            while (i + 1 < parts.length && parts[i + 1] !== "</antThinking>") {
              thinkingContent += parts[++i];
            }
            if (i + 1 < parts.length && parts[i + 1] === "</antThinking>") {
              thinkingContent += parts[++i]; // Include closing tag
            }
            renderedComponents.push(
              <Suspense key={`thinking-${i}`}>
                <AntThinkingComponent content={thinkingContent} />
              </Suspense>,
            );
          } else if (part.startsWith("<antArtifact")) {
            let artifactContent = part;
            while (i + 1 < parts.length && !parts[i + 1].startsWith("</antArtifact>")) {
              artifactContent += parts[++i];
            }
            if (i + 1 < parts.length && parts[i + 1].startsWith("</antArtifact>")) {
              artifactContent += parts[++i]; // Include closing tag
            }
            const title = (artifactContent.match(/title="([^"]*)"/) || [])[1];
            renderedComponents.push(
              <Suspense key={`artifact-${i}`}>
                <AntArtifactComponent
                  title={title}
                  content={artifactContent}
                />
              </Suspense>,
            );
          } else if (part && !part.startsWith("<")) {
            const _html = await markdownToHTML(part);
            renderedComponents.push(
              <ExecutionContent
                key={i}
                content={sanitizeHTML(_html)}
              />,
            );
          }
        }

        setHtmlParts(renderedComponents);
      };

      generateFinalHtml();
      scrollToBottom?.();
    }, [content]);

    return htmlParts;
  },
);

const MessageContent = memo(({ content, shouldStream, onStreamingFinished }: MessageContentProps) => {
  const dispatch = useAppDispatch();
  const { streamedText, hasFinished } = useTextSimulationStreaming({
    text: content,
    shouldStream,
  });

  useEffect(() => {
    if (hasFinished) {
      dispatch(setIsSimulationStreaming(false));

      onStreamingFinished?.();
    }
  }, [hasFinished]);

  return <>{streamedText}</>;
});

export default function Message({
  message,
  isInitialMessage = false,
  retryExecution,
  showInputs,
  saveAsDocument,
  scrollToBottom,
}: Props) {
  const { fromUser, isHighlight, type, text } = message;
  const dispatch = useAppDispatch();
  const [copyToClipboard, copyResult] = useCopyToClipboard();
  const [documentSaved, setSaveDocument] = useState(false);
  const [openExportPopup, setOpenExportPopup] = useState(false);

  const gptGenerationStatus = useAppSelector(
    state => state.chat?.gptGenerationStatus ?? initialChatState.gptGenerationStatus,
  );

  const inputs = useAppSelector(store => store.chat?.inputs ?? initialChatState.inputs);
  const answers = type === "workflowExecution" ? getWorkflowInputsValues(message.data as IWorkflowCreateResponse) : [];

  const saveDocument = async () => {
    if (typeof saveAsDocument !== "function" || documentSaved) {
      return;
    }

    setSaveDocument(true);

    const saved = saveAsDocument();

    if (!saved) {
      setSaveDocument(false);
      dispatch(setToast({ message: "Document was not saved, please retry again.", severity: "warning" }));
      return;
    }
  };

  return (
    <Stack
      width={!fromUser && type !== "html" ? "fit-content" : "100%"}
      alignItems={fromUser ? "end" : "start"}
      sx={{
        gap: "24px",
        ...(message.noHeader && {
          mt: "-34px",
        }),
      }}
    >
      {type === "workflowExecution" && inputs.length > 0 && (
        <MessageInputs
          message={createMessage({ type: "form", noHeader: true })}
          answers={answers}
          disabled
        />
      )}
      <MessageContainer message={message}>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"onSurface"}
          sx={{
            p: "16px 20px",
            borderRadius: fromUser
              ? "100px 0px 100px 100px"
              : isInitialMessage
                ? "0px 100px 100px 100px"
                : "0px 16px 16px 16px",
            bgcolor: fromUser ? "#9aedd3" : isHighlight ? "#DFDAFF" : "#F8F7FF",
          }}
        >
          {["workflowExecution", "html"].includes(type) ? (
            <Stack
              width={"100%"}
              minHeight={"40px"}
            >
              <MessageContentWithHTML
                content={text}
                scrollToBottom={scrollToBottom}
              />
              {type === "workflowExecution" && (
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={2}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <CustomTooltip title={"Repeat"}>
                      <IconButton
                        onClick={retryExecution}
                        disabled={["started", "streaming"].includes(gptGenerationStatus)}
                        sx={iconBtnStyle}
                      >
                        <Replay />
                      </IconButton>
                    </CustomTooltip>
                    {!!inputs.length && (
                      <CustomTooltip title={"Edit"}>
                        <IconButton
                          onClick={showInputs}
                          disabled={["started", "streaming"].includes(gptGenerationStatus)}
                          sx={iconBtnStyle}
                        >
                          <EditOutlined />
                        </IconButton>
                      </CustomTooltip>
                    )}
                    <CustomTooltip title={documentSaved ? "Document saved" : "Save to workspace"}>
                      <IconButton
                        onClick={saveDocument}
                        disabled={["started", "streaming"].includes(gptGenerationStatus) || documentSaved}
                        sx={iconBtnStyle}
                      >
                        <CreateNewFolderOutlined />
                      </IconButton>
                    </CustomTooltip>

                    <CustomTooltip title={"Share"}>
                      <>
                        <IconButton
                          onClick={() => setOpenExportPopup(true)}
                          disabled={["started", "streaming"].includes(gptGenerationStatus)}
                          sx={iconBtnStyle}
                        >
                          <ShareOutlined />
                        </IconButton>

                        {openExportPopup && (
                          <ExportPopupChat
                            onClose={() => setOpenExportPopup(false)}
                            content={text}
                          />
                        )}
                      </>
                    </CustomTooltip>
                  </Stack>
                  <Button
                    onClick={() => copyToClipboard(message.text)}
                    startIcon={copyResult?.state === "success" ? <Done /> : <ContentCopy />}
                    variant="text"
                    sx={btnStyle}
                  >
                    Copy
                  </Button>
                </Stack>
              )}
            </Stack>
          ) : (
            <MessageContent
              content={text}
              shouldStream={!fromUser}
              onStreamingFinished={scrollToBottom}
            />
          )}
        </Typography>
      </MessageContainer>
    </Stack>
  );
}

const btnStyle = {
  fontSize: 13,
  fontWeight: 500,
  color: "onSurface",
  p: "6px 24px",
  svg: {
    fontSize: 12,
  },
  "&:hover": {
    bgcolor: "action.hover",
    color: "onSurface",
  },
};
const iconBtnStyle = {
  ...btnStyle,
  border: "none",
  p: "6px",
  svg: {
    width: 22,
    height: 22,
  },
};
