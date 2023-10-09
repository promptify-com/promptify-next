import { PromptLiveResponse } from "@/common/types/prompt";
import { Templates } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

interface Props {
  template: Templates;
  execution: PromptLiveResponse | null;
}

export default function GeneratedExecutionFooter({ template, execution }: Props) {
  const currentGeneratedPrompt = useMemo(() => {
    if (execution?.data?.length) {
      const loadingPrompt = execution.data.find(prompt => prompt.isLoading);
      const prompt = template.prompts.find(prompt => prompt.id === loadingPrompt?.prompt);
      if (prompt) return prompt;
    }

    return null;
  }, [template, execution]);

  if (!currentGeneratedPrompt) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 998,
        bgcolor: "surface.1",
      }}
    >
      <Divider sx={{ borderColor: "surface.3" }} />
      <Typography
        sx={{
          padding: "8px 16px 5px",
          textAlign: "right",
          fontSize: 11,
          fontWeight: 500,
          opacity: 0.3,
        }}
      >
        Prompt #{currentGeneratedPrompt.order}: {currentGeneratedPrompt.title}
      </Typography>
    </Box>
  );
}
