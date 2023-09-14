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
          multiline
          disabled={disabled}
          fullWidth
          sx={{
            ml: 1,
            flex: 1,
            fontSize: 13,
            p: "3px",
            lineHeight: "22px",
            letterSpacing: "0.46px",
            fontWeight: "500",
            maxHeight: "60px",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "3px",
              p: 1,
              backgroundColor: "surface.5",
            },
            "&::-webkit-scrollbar-track": {
              webkitBoxShadow: "inset 0 0 16px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "surface.3",
              outline: "1px solid surface.1",
              borderRadius: "10px",
            },
          }}
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
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
      </Box>
    </Grid>
  );
};
