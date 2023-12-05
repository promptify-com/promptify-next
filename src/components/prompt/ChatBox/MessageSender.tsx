import React, { useRef, useState } from "react";
import { InputBase, Box, IconButton } from "@mui/material";
import { ArrowForward, KeyboardCommandKey, Send } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import SlowMotionVideo from "@mui/icons-material/SlowMotionVideo";

interface MessageSenderProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
  onGenerate: () => void;
  showGenerate: boolean;
}

const MessageSender: React.FC<MessageSenderProps> = ({
  onSubmit,
  disabled,
  placeholder = "Chat with Promptify",
  onGenerate,
  showGenerate,
}) => {
  const [localValue, setLocalValue] = useState("");
  const fieldRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
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
      borderRadius="24px"
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
        sx={{
          border: "none",
          bgcolor: localValue ? "primary.light" : "transparent",
          p: "4px",
          width: "27px",
          height: "27px",
          ":hover": {
            bgcolor: showGenerate ? "inherit" : "#626673",
          },
          "& svg": {
            width: showGenerate && !localValue ? "24px" : "19px",
            height: showGenerate && !localValue ? "24px" : "19px",
          },
        }}
      >
        {showGenerate && !localValue ? (
          <SlowMotionVideo
            onClick={() => {
              if (isGenerating) {
                return;
              }

              onGenerate?.();
            }}
            sx={{
              color: isGenerating ? "text.secondary" : "#375CA9",
              cursor: isGenerating ? "not-allowed" : "pointer",
            }}
          />
        ) : (
          <ArrowForward
            onClick={() => {
              if (!localValue || isGenerating) {
                return;
              }

              handleSubmit();
            }}
            sx={{
              color: "surface.1",
            }}
          />
        )}
      </IconButton>
    </Box>
  );
};

export default MessageSender;
