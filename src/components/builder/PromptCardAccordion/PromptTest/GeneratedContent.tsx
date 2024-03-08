import React, { useRef } from "react";
import Box from "@mui/material/Box";
import { EngineOutput } from "@/core/api/dto/templates";
import useScrollToBottom from "@/components/Prompt/Hooks/useScrollToBottom";
import ExecutionOutput from "@/components/builder/ExecutionOutput";
import ScrollDownButton from "@/components/common/buttons/ScrollDownButton";

interface GeneratedContentProps {
  content: string;
  engineType: EngineOutput;
  isGenerating: boolean;
}

function GeneratedContent({ content, engineType, isGenerating }: GeneratedContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { showScrollDown, scrollToBottom } = useScrollToBottom({ ref: containerRef, content });

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
        <ScrollDownButton
          sticky
          onClick={scrollToBottom}
        />
      )}
    </Box>
  );
}

export default GeneratedContent;
