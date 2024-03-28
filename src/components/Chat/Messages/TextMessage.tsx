import { memo, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Check from "@mui/icons-material/Check";
import Edit from "@mui/icons-material/Edit";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { timeAgo } from "@/common/helpers/timeManipulation";
import { setAnswers, setIsSimulationStreaming } from "@/core/store/chatSlice";
import ClientOnly from "@/components/base/ClientOnly";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import type { IAnswer, IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  message: IMessage;
  onScrollToBottom: () => void;
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

const Message = ({ message, onScrollToBottom }: Props) => {
  const { inputs, answers } = useAppSelector(state => state.chat);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [messageContent, setMessageContent] = useState(message.text);

  const dispatch = useAppDispatch();

  const { fromUser, text, createdAt, isEditable, questionInputName } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  useEffect(() => {
    if (fromUser) return;
    dispatch(setIsSimulationStreaming(true));
  }, []);

  const dispatchUpdateAnswers = useDebouncedDispatch((value: string) => {
    updateAnswers(value);
  }, 400);

  const updateAnswers = (value: string) => {
    const matchedInput = inputs.find(input => input.name === questionInputName);
    if (!matchedInput) {
      return;
    }

    const { required, question, name: inputName, prompt } = matchedInput;

    const _answers = [...answers.filter(answer => answer.inputName !== questionInputName)];

    const newAnswer: IAnswer = {
      question: question!,
      required,
      inputName,
      prompt: prompt!,
      answer: value || text,
    };
    _answers.push(newAnswer);

    dispatch(setAnswers(_answers));
  };

  const handleEditMessage = (value: string) => {
    setMessageContent(value);
    dispatchUpdateAnswers(value);
  };

  const allowEditMessage = isEditable && fromUser && !isEditing;

  if (message.type !== "text") {
    return;
  }

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
      position={"relative"}
      width={!fromUser ? "fit-content" : "100%"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <ClientOnly>
          <Typography
            sx={{
              position: "absolute",
              top: -20,
              opacity: 0.5,
              right: fromUser ? 0 : "",
              left: !fromUser ? 2 : "",
              ...(!fromUser && { width: "100%" }),
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
        width={fromUser ? "fit-content" : "100%"}
        gap={"8px"}
        p={fromUser ? "16px 16px 16px 24px" : 0}
        borderRadius={"24px"}
        bgcolor={fromUser ? "primary.main" : "transparent"}
        ml={"auto"}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"8px"}
          alignItems={"start"}
        >
          <Typography
            fontSize={16}
            lineHeight={"25.6px"}
            fontWeight={400}
            letterSpacing={"0.17px"}
            display={"flex"}
            alignItems={"center"}
            color={fromUser ? "onPrimary" : "onSurface"}
            pr={fromUser && isEditable ? "34px" : 0}
            position={"relative"}
          >
            {isEditing ? (
              <>
                <InputBase
                  value={messageContent}
                  onChange={event => handleEditMessage(event.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  sx={{
                    color: "onPrimary",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "25.6px",
                    letterSpacing: "0.17px",
                  }}
                  size="small"
                />
                <IconButton
                  onClick={() => setIsEditing(false)}
                  size="small"
                  sx={iconButtonStyle}
                >
                  <Check />
                </IconButton>
              </>
            ) : (
              <MessageContent
                content={messageContent || text}
                shouldStream={!fromUser}
                onStreamingFinished={onScrollToBottom}
              />
            )}
            {allowEditMessage && (
              <IconButton
                onClick={() => setIsEditing(true)}
                size="small"
                sx={iconButtonStyle}
              >
                <Edit />
              </IconButton>
            )}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

const iconButtonStyle = {
  position: "absolute",
  right: -3,
  border: "none",
  color: "onPrimary",
  "&:hover": {
    bgcolor: "action.hover",
    color: "onPrimary",
  },
};

export default Message;
