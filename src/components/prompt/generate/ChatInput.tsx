import React from "react";
import { Send } from "@mui/icons-material";
import { Box, Grid, InputBase } from "@mui/material";

interface ChatInputProps {
  onChange: (str: string) => void;
  value: string;
  onSubmit: () => void;
  disabled: boolean;
}

export const ChatInput = ({ onChange, value, onSubmit, disabled }: ChatInputProps) => {
  return (
    <Grid
      p={"16px"}
      position={{ xs: "fixed", md: "inherit" }}
      bottom={"60px"}
      zIndex={99}
      width={"100%"}
      left={0}
      flex={1}
      right={0}
    >
      <Box
        bgcolor={"surface.3"}
        display={"flex"}
        alignItems={"center"}
        borderRadius="99px"
        minHeight={"32px"}
        p={"8px 16px"}
      >
        <InputBase
          disabled={disabled}
          fullWidth
          sx={{ ml: 1, flex: 1, fontSize: 13, lineHeight: "22px", letterSpacing: "0.46px", fontWeight: "500" }}
          placeholder="Chat with Promptify"
          inputProps={{ "aria-label": "Name" }}
          onChange={e => onChange(e.target.value)}
          value={value}
          onKeyPress={e => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />

        <Send
          onClick={onSubmit}
          sx={{
            cursor: "pointer",
          }}
        />
      </Box>
    </Grid>
  );
};
