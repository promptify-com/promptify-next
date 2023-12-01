import { useState } from "react";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import KeyboardCommandKey from "@mui/icons-material/KeyboardCommandKey";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import PlayCircleFilledWhiteOutlined from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAccordionChatMode } from "@/core/store/templatesSlice";
import { theme } from "@/theme";

interface MessageSenderProps {
  onSubmit: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
  mode?: "chat" | "other";
  onGenerate?: () => void;
  showGenerate?: boolean;
}

function MessageSender({
  onSubmit,
  disabled,
  placeholder = "Chat with Promptify",
  mode = "other",
  onGenerate,
  showGenerate,
}: MessageSenderProps) {
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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

  const hasNoValue = localValue !== "";

  return (
    <Box
      display={"flex"}
      position={"relative"}
      bgcolor={isFocused || hasNoValue ? "surface.1" : "surface.3"}
      alignItems={"center"}
      boxShadow={isFocused || hasNoValue ? "0px 4px 8px 0px #E1E2EC, 0px 0px 4px 0px rgba(0, 0, 0, 0.10)" : undefined}
      borderRadius="24px"
      p={"8px 16px"}
    >
      <KeyboardCommandKey
        sx={{ fontSize: "20px", color: "text.secondary", position: "absolute", left: 9, top: 25, opacity: 0.5 }}
      />

      {mode === "chat" ? (
        <Box width={{ md: "90%", xs: "87%" }}>
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
            onChange={e => setLocalValue(e.target.value)}
            value={localValue}
            onKeyPress={handleKeyPress}
          />

          <Button
            onClick={() => {
              dispatch(setAccordionChatMode("execution"));
              onGenerate?.();
            }}
            startIcon={<PlayCircleFilledWhiteOutlined />}
            disabled={!showGenerate || isGenerating}
            sx={{
              height: "22px",
              p: { xs: "8px", md: "15px" },
              fontSize: { xs: 12, md: 13 },
              ml: "20px",
              mt: "5px",
              lineHeight: "110%",
              letterSpacing: "0.2px",
              fontWeight: 500,
              color: showGenerate && !isGenerating ? "primary" : `#ACACBE!important`,
              bgcolor: showGenerate && !isGenerating ? "#375CA9" : `#F7F7F8!important`,
              borderColor: showGenerate && !isGenerating ? "#375CA9" : "transparent",
              ":hover": {
                bgcolor: "action.hover",
              },
            }}
            variant={"contained"}
          >
            Run prompts
          </Button>
        </Box>
      ) : (
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
          onChange={e => setLocalValue(e.target.value)}
          value={localValue}
          onKeyPress={handleKeyPress}
        />
      )}

      <Box
        sx={{
          position: "absolute",
          top: 25,
          right: 13,
          padding: "4px",
          width: "25px",
          height: "25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "24px",
          bgcolor: !hasNoValue ? undefined : "primary.main",
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
}

export default MessageSender;
