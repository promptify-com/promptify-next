import React from "react";
import { Grid } from "@mui/material";

import { Message } from "./ChatBox";
import MessageBlock from "./MessageItem";

export const ChatMessages = ({ messages }: { messages: Message[] }) => {
  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
    >
      {messages.map((msg, idx) => (
        <MessageBlock
          key={idx}
          hideHeader={idx === 1}
          message={msg}
        />
      ))}
    </Grid>
  );
};
