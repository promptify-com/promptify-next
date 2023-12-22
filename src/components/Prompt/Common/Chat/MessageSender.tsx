import { useState } from "react";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import KeyboardCommandKey from "@mui/icons-material/KeyboardCommandKey";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { useAppSelector } from "@/hooks/useStore";
import SlowMotionVideo from "@mui/icons-material/SlowMotionVideo";
import { CircularProgress } from "@mui/material";

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

  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
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

  return (
    <Box
      display={"flex"}
      position={"relative"}
      bgcolor={isFocused || hasValue ? "surface.1" : "surface.3"}
      alignItems={"center"}
      boxShadow={isFocused || hasValue ? "0px 4px 8px 0px #E1E2EC, 0px 0px 4px 0px rgba(0, 0, 0, 0.10)" : undefined}
      borderRadius="24px"
      p={"8px 16px"}
    >
      <KeyboardCommandKey
        sx={{ fontSize: "20px", color: "text.secondary", position: "absolute", left: 9, top: 12, opacity: 0.5 }}
      />

      <InputBase
        onFocus={() => setIsFocused(true)}
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
        onChange={e => handleChange(e.target.value)}
        value={localValue}
        onKeyPress={handleKeyPress}
      />

      <Box
        sx={{
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
          bgcolor: !hasValue ? undefined : "primary.main",
          color: { xs: !hasValue ? "#8E8E94" : "white", md: "white" },
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
          <ArrowUpward
            onClick={handleSubmit}
            sx={{
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default MessageSender;
