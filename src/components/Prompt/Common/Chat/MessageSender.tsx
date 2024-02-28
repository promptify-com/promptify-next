import { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardCommandKey from "@mui/icons-material/KeyboardCommandKey";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SlowMotionVideo from "@mui/icons-material/SlowMotionVideo";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowForward from "@mui/icons-material/ArrowForward";

import { useAppSelector } from "@/hooks/useStore";
import useVariant from "@/components/Prompt/Hooks/useVariant";

interface MessageSenderProps {
  onSubmit: (value: string) => void;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  mode?: "chat" | "other";
  onGenerate?: () => void;
  showGenerate?: boolean;
  maxLength?: number;
  loading?: boolean;
}

function MessageSender({
  onSubmit,
  onChange,
  disabled,
  placeholder = "Chat with Promptify",
  mode = "other",
  onGenerate,
  showGenerate,
  maxLength,
  loading,
}: MessageSenderProps) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const globalValue = useAppSelector(state => state.chat.value);

  const { isVariantB } = useVariant();
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const fieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLocalValue(globalValue);
  }, [globalValue]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
  };

  const hasValue = localValue !== "";
  const isFocusedAndVariantB = isVariantB && (isFocused || hasValue);

  return (
    <Box
      display={"flex"}
      position={"relative"}
      bgcolor={isFocusedAndVariantB ? "surface.1" : "surface.3"}
      alignItems={"center"}
      boxShadow={isFocusedAndVariantB ? "0px 4px 8px 0px #E1E2EC, 0px 0px 4px 0px rgba(0, 0, 0, 0.10)" : undefined}
      borderRadius="24px"
      p={"8px 16px"}
    >
      <KeyboardCommandKey
        onClick={() => fieldRef.current?.focus()}
        sx={{ fontSize: "20px", color: "text.secondary", position: "absolute", left: 9, top: 12, opacity: 0.5 }}
      />

      <InputBase
        inputRef={ref => (fieldRef.current = ref)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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

      <Box
        sx={{
          color: { xs: !hasValue ? "#8E8E94" : "white", md: "white" },
          ...boxStyle,
          ...(hasValue && { bgcolor: "primary.main" }),
        }}
      >
        {loading ? (
          <CircularProgress
            size={"20px"}
            sx={{ color: "primary.light", p: "4px" }}
          />
        ) : mode === "chat" && showGenerate && !localValue ? (
          <SlowMotionVideo
            onClick={() => {
              if (isGenerating) {
                return;
              }
              onGenerate?.();
            }}
            sx={{
              color: isGenerating ? "text.secondary" : "primary.main",
              cursor: isGenerating ? "not-allowed" : "pointer",
            }}
          />
        ) : (
          <>
            {isVariantB ? (
              <ArrowUpward
                onClick={handleSubmit}
                sx={{
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              />
            ) : (
              <ArrowForward
                onClick={handleSubmit}
                sx={{
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default MessageSender;

const inputStyle = {
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
};

const boxStyle = {
  position: "absolute",
  top: 6,
  right: 13,
  padding: "4px",
  width: "25px",
  height: "25px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "24px",
};
