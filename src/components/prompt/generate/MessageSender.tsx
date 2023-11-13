import React, { useState } from "react";
import { InputBase, Box } from "@mui/material";
import Send from "@mui/icons-material/SEnd";

interface MessageSenderProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
}

const MessageSender: React.FC<MessageSenderProps> = ({ onSubmit, disabled, placeholder = "Chat with Promptify" }) => {
  const [localValue, setLocalValue] = useState("");

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
          ".Mui-disabled": {
            cursor: disabled ? "not-allowed" : "auto",
          },
        }}
        placeholder={placeholder}
        inputProps={{ "aria-label": "Name" }}
        onChange={e => setLocalValue(e.target.value)}
        value={localValue}
        onKeyPress={handleKeyPress}
      />
      <Send
        onClick={handleSubmit}
        sx={{
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
    </Box>
  );
};

export default MessageSender;
