import Stack from "@mui/material/Stack";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import Typography from "@mui/material/Typography";
import { fadeIn } from "@/theme/animations";
import { useRouter } from "next/router";
import { useGetSuggestionsQuery } from "@/core/api/chats";
import { useEffect, useState } from "react";
import { ISuggestion } from "@/core/api/dto/chats";

function SuggestedPrompts() {
  const router = useRouter();

  const [prompts, setPrompts] = useState<string[]>([]);

  const { data: fetchedPrompts } = useGetSuggestionsQuery();

  const handleClickPrompt = (prompt: string) => {
    router.replace({ pathname: router.pathname, query: { ...router.query, prompt } }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (fetchedPrompts) {
      const tempPrompts = fetchedPrompts.map((prompt: ISuggestion) => prompt.question);

      setPrompts(tempPrompts);
    }
  }, [fetchedPrompts]);

  return (
    <Stack
      sx={{
        opacity: 0,
        animation: `${fadeIn} 0.5s ease-in 1.6s forwards`,
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        gap: { xs: "8px", md: "24px" },
        m: { xs: "8px", md: 0 },
      }}
    >
      {prompts.map((prompt, index) => (
        <Stack
          width={{ xs: "-webkit-fill-available", md: "100%" }}
          direction={{ xs: "row", md: "column" }}
          alignItems={{ xs: "center", md: "flex-start" }}
          justifyContent={{ md: "space-between" }}
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
          onClick={() => handleClickPrompt(prompt)}
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
