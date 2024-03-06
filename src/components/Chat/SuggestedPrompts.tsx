import Stack from "@mui/material/Stack";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import Typography from "@mui/material/Typography";

import { useAppDispatch } from "@/hooks/useStore";
import { setMessageSenderValue } from "@/core/store/chatSlice";

function SuggestedPrompts() {
  const dispatch = useAppDispatch();
  const prompts = [
    "Explain me how Promptify works",
    "What is difference between LLM models?",
    "How to plan my exercise schedule?",
  ];
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
    >
      {prompts.map((prompt, index) => (
        <Stack
          direction={"column"}
          alignItems={"flex-start"}
          justifyContent={"space-between"}
          key={index}
          border={"1px solid"}
          borderColor={"#E3E2E6"}
          borderRadius={"16px"}
          p={"16px"}
          gap={2}
          sx={{
            cursor: "pointer",
            userSelect: "none",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
          onClick={() => dispatch(setMessageSenderValue(prompt))}
        >
          <EmojiObjectsOutlinedIcon />
          <Typography
            fontSize={15}
            fontWeight={400}
            lineHeight={"20.25px"}
          >
            {prompt}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default SuggestedPrompts;
