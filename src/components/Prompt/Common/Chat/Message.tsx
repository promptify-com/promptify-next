import { memo, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import ClientOnly from "@/components/base/ClientOnly";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import type { IMessage } from "@/components/Prompt/Types/chat";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import { Avatar, Stack } from "@mui/material";
import { isDesktopViewPort } from "@/common/helpers";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { LogoApp } from "@/assets/icons/LogoApp";

interface MessageBlockProps {
  message: IMessage;
  onScrollToBottom: () => void;
  isExecutionMode: boolean;
}

interface MessageContentProps {
  content: string;
  shouldStream: boolean;
  onStreamingFinished: () => void;
}

const MessageContent = memo(({ content, shouldStream, onStreamingFinished }: MessageContentProps) => {
  const dispatch = useAppDispatch();
  const { streamedText, hasFinished } = useTextSimulationStreaming({
    text: content,
    shouldStream,
  });

  useEffect(() => {
    if (hasFinished) {
      dispatch(setIsSimulationStreaming(false));

      onStreamingFinished();
    }
  }, [hasFinished]);

  return <>{streamedText}</>;
});

const MessageContentWithHTML = memo(({ content }: { content: string }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!content) {
      return;
    }

    const generateFinalHtml = async () => {
      const _html = await markdownToHTML(content);
      setHtml(_html);
    };

    generateFinalHtml();
  }, [content]);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHTML(html),
      }}
    />
  );
});

export const Message = ({ message, isExecutionMode, onScrollToBottom }: MessageBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isVariantA, isVariantB } = useVariant();

  const isDesktopView = isDesktopViewPort();

  const dispatch = useAppDispatch();

  const { fromUser, text, createdAt, type } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  useEffect(() => {
    if (fromUser || type === "html") return;
    dispatch(setIsSimulationStreaming(true));
  }, []);

  const isTypeFormOrSpark = type === "form" || type === "spark";
  if (isTypeFormOrSpark) return;

  return (
    <Grid
      display={isExecutionMode ? "none" : "flex"}
      flexDirection={isVariantA ? "row" : "column"}
      gap={"16px"}
      position={"relative"}
      width={!fromUser ? "fit-content" : "100%"}
      py={isVariantA ? { xs: "8px", md: "16px" } : 0}
      {...(isVariantB && {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      })}
    >
      {isVariantA && !isExecutionMode && !message.noHeader && isDesktopView && (
        <>
          {message.type === "spark" ? (
            <Stack
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#375CA91F" }}
            >
              <CheckCircle sx={{ color: "#375CA9" }} />
            </Stack>
          ) : message.fromUser && currentUser ? (
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.first_name}
              sx={{
                width: 32,
                height: 32,
                bgcolor: "surface.5",
              }}
            />
          ) : (
            <Stack
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#000" }}
            >
              <LogoApp
                width={18}
                color="#fff"
              />
            </Stack>
          )}
        </>
      )}
      {isVariantB && isHovered && (
        <ClientOnly>
          <Typography
            sx={{
              position: "absolute",
              top: -20,
              opacity: 0.5,
              right: fromUser ? 0 : "",
              left: !fromUser ? 2 : "",
            }}
            fontSize={12}
            variant="caption"
          >
            {name} {timeAgo(createdAt)}
          </Typography>
        </ClientOnly>
      )}

      <Grid
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        width={fromUser ? "content-fit" : "100%"}
        gap={"8px"}
        padding={isVariantB ? "8px 16px 8px 24px" : 0}
        borderRadius={!fromUser ? "0px 16px 16px 16px" : "16px 16px 0px 16px"}
        {...(isVariantB && { bgcolor: fromUser ? "#7254721A" : "surface.2" })}
      >
        {isVariantA && !message.noHeader && (
          <Grid
            display={"flex"}
            alignItems={"center"}
            flexWrap={"wrap"}
            gap={"8px"}
          >
            <Typography
              fontSize={12}
              fontWeight={600}
              color={"onSurface"}
            >
              {name}
            </Typography>
            {message.type === "spark" && (
              <Typography
                fontSize={12}
                color={"text.secondary"}
                sx={{
                  opacity: 0.45,
                }}
              >
                Successfully done generation
              </Typography>
            )}
            <ClientOnly>
              <Typography
                fontSize={12}
                fontWeight={400}
                color={"onSurface"}
                sx={{
                  opacity: 0.5,
                }}
              >
                {timeAgo(createdAt)}
              </Typography>
            </ClientOnly>
          </Grid>
        )}
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"8px"}
          alignItems={"start"}
        >
          <Typography
            fontSize={isVariantA ? 14 : 15}
            lineHeight={"24px"}
            letterSpacing={"0.17px"}
            display={"flex"}
            alignItems={"center"}
            color={isVariantB && fromUser ? "#725472" : "onSurface"}
          >
            {type === "html" ? (
              <MessageContentWithHTML content={text} />
            ) : (
              <MessageContent
                content={text}
                shouldStream={!fromUser}
                onStreamingFinished={onScrollToBottom}
              />
            )}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
