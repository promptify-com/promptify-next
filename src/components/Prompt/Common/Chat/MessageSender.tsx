import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setMessageSenderValue } from "@/core/store/chatSlice";
import ArrowCircleUp from "@/assets/icons/ArrowCircleUp";

interface MessageSenderProps {
  onSubmit: (value: string) => void;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  loading?: boolean;
}

function MessageSender({
  onSubmit,
  onChange,
  disabled,
  placeholder = "Chat with Promptify...",
  maxLength,
  loading,
}: MessageSenderProps) {
  const dispatch = useAppDispatch();
  const MessageSenderValue = useAppSelector(state => state.chat.MessageSenderValue);

  const [localValue, setLocalValue] = useState("");

  useEffect(() => {
    setLocalValue(MessageSenderValue);
  }, [MessageSenderValue]);

  const resetGlobalValue = () => !!MessageSenderValue && dispatch(setMessageSenderValue(""));

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      resetGlobalValue();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setLocalValue(localValue + "\n");
    }
  };

  const handleChange = (val: string) => {
    if (maxLength && val.length > maxLength) return;
    setLocalValue(val);
    if (typeof onChange === "function") onChange(val);
  };

  const handleSubmit = () => {
    onSubmit(localValue);
    setLocalValue("");
    resetGlobalValue();
  };

  const hasValue = localValue !== "";

  return (
    <Box
      display={"flex"}
      position={"relative"}
      bgcolor={"surfaceContainerLow"}
      alignItems={"center"}
      borderRadius="44px"
      gap={2}
      p={"8px 8px 8px 24px"}
    >
      <InputBase
        multiline
        disabled={disabled}
        fullWidth
        sx={{
          ...inputStyle,
          ".Mui-disabled": {
            cursor: disabled ? "not-allowed" : "auto",
          },
        }}
        placeholder={placeholder}
        inputProps={{ "aria-label": "Name" }}
        onChange={e => handleChange(e.target.value)}
        value={localValue}
        onKeyPress={handleKeyPress}
      />

      <Box mt={0.5}>
        {loading ? (
          <CircularProgress
            size={"20px"}
            sx={{ color: "primary.light", p: "4px" }}
          />
        ) : (
          <Box
            onClick={handleSubmit}
            sx={{ cursor: "pointer" }}
          >
            <ArrowCircleUp
              height="32"
              width="32"
              color={!hasValue ? "white" : "#375CA9"}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MessageSender;

const inputStyle = {
  flex: 1,
  fontSize: 16,
  color: "onSurface",
  lineHeight: "22px",
  letterSpacing: "0.46px",
  fontWeight: "400",
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
};
