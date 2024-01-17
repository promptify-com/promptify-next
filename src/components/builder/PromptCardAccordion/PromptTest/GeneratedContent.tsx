import React, { useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { EngineOutput } from "@/core/api/dto/templates";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrolltoBottom";
import { South } from "@mui/icons-material";
import ExecutionOutput from "@/components/builder/ExecutionOutput";

interface GeneratedContentProps {
  content: string;
  engineType: EngineOutput;
  isGenerating: boolean;
}

function GeneratedContent({ content, engineType, isGenerating }: GeneratedContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { showScrollDown, scrollToBottom } = useScrollToBottom({ ref: containerRef, isGenerating, content });

  return (
    <Box
      ref={containerRef}
      sx={{
        border: "1px solid rgba(27, 27, 30, 0.23)",
        borderRadius: "8px",
        p: "12px",
        height: "60svh",
        overflow: "auto",
        overscrollBehavior: "contain",
        position: "relative",
      }}
    >
      <ExecutionOutput
        output={content}
        engineType={engineType}
      />
      {showScrollDown && isGenerating && (
        <IconButton
          onClick={scrollToBottom}
          sx={{
            height: "32px",
            width: "32px",
            position: "sticky",
            left: "50%",
            bottom: "30px",
            zIndex: 999,
            bgcolor: "surface.3",
            boxShadow: "0px 4px 8px 3px #e1e2ece6, 0px 0px 4px 0px rgb(0 0 0 / 0%)",
            border: " none",
            ":hover": {
              bgcolor: "surface.5",
            },
          }}
        >
          <South sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );
}

export default GeneratedContent;
