import React, { useState } from "react";
import { InputBase, Box } from "@mui/material";
import { ArrowUpward, KeyboardCommandKey, Send } from "@mui/icons-material";
import { theme } from "@/theme";

interface MessageSenderProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
}

const MessageSender: React.FC<MessageSenderProps> = ({ onSubmit, disabled, placeholder = "Chat with Promptify" }) => {
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  const hasNoValue = localValue !== "";

  return (
    <Box
      display={"flex"}
      position={"relative"}
      bgcolor={isFocused || hasNoValue ? "surface.1" : "surface.3"}
      alignItems={"center"}
      boxShadow={isFocused || hasNoValue ? "0px 4px 8px 0px #E1E2EC, 0px 0px 4px 0px rgba(0, 0, 0, 0.10)" : undefined}
      borderRadius="99px"
      p={"8px 16px"}
    >
      <KeyboardCommandKey
        sx={{ fontSize: "20px", color: "text.secondary", position: "absolute", left: 9, top: 11, opacity: 0.5 }}
      />
      <InputBase
        onFocus={() => setIsFocused(true)} // Set focus state to true
        onBlur={() => setIsFocused(false)}
        multiline
        disabled={disabled}
        fullWidth
        sx={{
          flex: 1,
          fontSize: 13,
          p: "3px",
          ml: "20px",
          mr: "40px",
          color: "onSurface",
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

      <Box
        sx={{
          position: "absolute",
          top: 5,
          right: 13,
          padding: "4px",
          width: "25px",
          height: "25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "99px",
          bgcolor: !hasNoValue ? undefined : theme.palette.primary.main,
          color: { xs: !hasNoValue ? "#8E8E94" : "white", md: "white" },
        }}
      >
        <ArrowUpward
          onClick={handleSubmit}
          sx={{
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
      </Box>
    </Box>
  );
};

export default MessageSender;
