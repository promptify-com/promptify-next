import React, { useRef, useState } from "react";
import { InputBase, Box, IconButton } from "@mui/material";
import { ArrowForward, KeyboardCommandKey, Send } from "@mui/icons-material";

interface MessageSenderProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
}

const MessageSender: React.FC<MessageSenderProps> = ({ onSubmit, disabled, placeholder = "Chat with Promptify" }) => {
  const [localValue, setLocalValue] = useState("");
  const fieldRef = useRef<HTMLInputElement | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    onSubmit(localValue);
    setLocalValue("");
  };

  return (
    <Box
      bgcolor={"surface.3"}
      display={"flex"}
      alignItems={"center"}
      borderRadius="99px"
      m={{ xs: "10px 16px", md: "16px 24px" }}
      p={"8px"}
    >
      <InputBase
        inputRef={ref => (fieldRef.current = ref)}
        multiline
        disabled={disabled}
        fullWidth
        placeholder={placeholder}
        inputProps={{ "aria-label": "Name" }}
        startAdornment={
          <IconButton onClick={() => fieldRef.current?.focus()}>
            <KeyboardCommandKey />
          </IconButton>
        }
        onChange={e => setLocalValue(e.target.value)}
        value={localValue}
        onKeyPress={handleKeyPress}
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
          "&.MuiInputBase-root": {
            m: 0,
          },
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
          ".Mui-disabled": {
            cursor: disabled ? "not-allowed" : "auto",
          },
          button: {
            p: "4px",
            color: "text.secondary",
            opacity: 0.45,
            mr: "8px",
            border: "none",
            ":hover": {
              bgcolor: "surface.1",
            },
          },
        }}
      />
      <IconButton
        onClick={handleSubmit}
        disabled={!localValue}
        sx={{
          border: "none",
          bgcolor: localValue ? "primary.light" : "transparent",
          p: "4px",
        }}
      >
        <ArrowForward
          sx={{
            color: "surface.1",
          }}
        />
      </IconButton>
    </Box>
  );
};

export default MessageSender;
