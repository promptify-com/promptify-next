import React, { useEffect, useRef } from "react";
import { Button, Grid, Typography, CircularProgress } from "@mui/material";

import { Message } from "./Message";
import { LogoApp } from "@/assets/icons/LogoApp";
import { useAppSelector } from "@/hooks/useStore";
import ThreeDotsAnimation from "@/components/design-system/ThreeDotsAnimation";
import { IMessage } from "@/common/types/chat";

interface Props {
  messages: IMessage[];
  onGenerate: () => void;
  showGenerate: boolean;
  onChange?: (value: string) => void;
  isValidating: boolean;
}

export const ChatInterface = ({
  messages,

  onGenerate,
  showGenerate,
  onChange,
  isValidating,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
        />
      ))}
      <ThreeDotsAnimation loading={isValidating} />
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
            ml: 9,
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
              color: "surface.1",
            },
          }}
          variant="contained"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Typography>Generation in progress...</Typography>
          ) : (
            <>
              <Typography sx={{ color: "inherit", fontSize: 13, lineHeight: "22px" }}>Generate</Typography>
              <Typography sx={{ ml: 1.5, color: "inherit", fontSize: 12 }}>~36s</Typography>
            </>
          )}
        </Button>
      )}
    </Grid>
  );
};
