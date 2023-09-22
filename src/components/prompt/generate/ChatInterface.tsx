import React, { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Button, Grid, Typography, CircularProgress, Stack } from "@mui/material";

import { Message } from "./Message";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector } from "@/hooks/useStore";
import ThreeDotsAnimation from "@/components/design-system/ThreeDotsAnimation";
import { IMessage } from "@/common/types/chat";
import { Edit } from "@mui/icons-material";

interface Props {
  messages: IMessage[];
  onGenerate: () => void;
  onVary: () => void;
  showGenerate: boolean;
  onChange?: (value: string) => void;
  isValidating: boolean;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
}

export const ChatInterface = ({
  messages,
  onGenerate,
  onVary,
  showGenerate,
  onChange,
  isValidating,
  setIsSimulaitonStreaming,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const isNotLastMessage = (message: IMessage) => {
    return message.type === "choices" && message !== messages[messages.length - 1];
  };

  return (
    <Grid
      ref={messagesContainerRef}
      display={"flex"}
      flex={1}
      width={"100%"}
      flexDirection={"column"}
      alignItems={"start"}
      pb={{ xs: "120px", md: "8px" }}
      sx={{
        overflow: "auto",
        overscrollBehavior: "contain",
        "&::-webkit-scrollbar": {
          width: "6px",
          p: 1,
          backgroundColor: "surface.5",
        },
        "&::-webkit-scrollbar-track": {
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "surface.1",
          outline: "1px solid surface.1",
          borderRadius: "10px",
        },
      }}
    >
      {messages.map((msg, idx) => (
        <Message
          key={idx}
          hideHeader={idx === 1}
          message={msg}
          onChangeValue={onChange}
          disabledChoices={isNotLastMessage(msg)}
          setIsSimulaitonStreaming={setIsSimulaitonStreaming}
        />
      ))}
      <ThreeDotsAnimation loading={isValidating} />
      <Stack
        direction={"row"}
        gap={2}
        px={3}
      >
        {showGenerate && (
          <Button
            onClick={onGenerate}
            startIcon={
              isGenerating ? (
                <CircularProgress size={16} />
              ) : (
                <LogoApp
                  color="white"
                  width={20}
                />
              )
            }
            sx={{
              bgcolor: "primary.main",
              borderColor: "primary.main",
              borderRadius: "999px",
              height: "22px",
              p: "15px",
              color: "15px",
              fontWeight: 500,
              ":hover": {
                opacity: 0.9,
                bgcolor: "primary.main",
                color: "onPrimary",
              },
            }}
            variant="contained"
            disabled={isGenerating || isValidating}
          >
            {isGenerating ? (
              <Typography>Generation in progress...</Typography>
            ) : (
              <>
                <Typography sx={{ color: "inherit", fontSize: 13, lineHeight: "22px" }}>Generate</Typography>
                <Typography sx={{ ml: 1.5, color: "inherit", fontSize: 12 }}>~360s</Typography>
              </>
            )}
          </Button>
        )}
        <Button
          variant="text"
          startIcon={<Edit />}
          sx={{
            border: "1px solid",
            height: "22px",
            p: "15px",
            fontSize: 13,
            fontWeight: 500,
            ":hover": {
              bgcolor: "action.hover",
            },
          }}
          disabled={isValidating || isGenerating}
          onClick={onVary}
        >
          Vary
        </Button>
      </Stack>
    </Grid>
  );
};
