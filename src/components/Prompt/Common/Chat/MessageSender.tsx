import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import ArrowCircleUp from "@/assets/icons/ArrowCircleUp";
import Stack from "@mui/material/Stack";
import BackspaceOutlined from "@mui/icons-material/BackspaceOutlined";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const queryPrompt = router.query.prompt as string;
  const [MessageSenderValue, setMessageSenderValue] = useState("");

  useEffect(() => {
    if (!queryPrompt) return;

    onSubmit(queryPrompt);

    delete router.query.prompt;
    router.replace({ pathname: router.pathname, query: router.query }, undefined, {
      shallow: true,
    });
  }, [queryPrompt]);

  const resetGlobalValue = () => !!MessageSenderValue && setMessageSenderValue("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      resetGlobalValue();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setMessageSenderValue(MessageSenderValue + "\n");
    }
  };

  const handleChange = (val: string) => {
    if (maxLength && val.length > maxLength) return;
    setMessageSenderValue(val);
    if (typeof onChange === "function") onChange(val);
  };

  const handleSubmit = () => {
    const trimmedValue = MessageSenderValue.trim();
    if (!trimmedValue) return;

    onSubmit(trimmedValue);
    setMessageSenderValue("");
    resetGlobalValue();
  };

  const hasValue = MessageSenderValue.trim() !== "";

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
        value={MessageSenderValue}
        onKeyPress={handleKeyPress}
      />

      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        {hasValue && (
          <BackspaceOutlined
            sx={{
              fontSize: "20px",
              cursor: "pointer",
              color: "text.secondary",
            }}
            onClick={() => {
              setMessageSenderValue("");
            }}
          />
        )}
        {loading ? (
          <CircularProgress
            size={"20px"}
            sx={{ color: "primary.light", p: "4px" }}
          />
        ) : (
          <Box
            onClick={handleSubmit}
            mt={1}
            sx={{ cursor: "pointer" }}
          >
            <ArrowCircleUp
              height="32"
              width="32"
              color={!hasValue ? "#DFE4D7" : "#375CA9"}
            />
          </Box>
        )}
      </Stack>
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
