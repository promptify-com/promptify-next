import { lazy, Suspense, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { ExecutionContent } from "@/components/common/ExecutionContent";
import type { DisplayPrompt, PromptLiveResponse } from "@/common/types/prompt";

const AntThinkingComponent = lazy(() => import("@/components/GPT/AntThinking"));
const AntArtifactComponent = lazy(() => import("@/components/GPT/AntArtifact"));

interface Props {
  execution: PromptLiveResponse;
}

export const ExecutionMessage: React.FC<Props> = ({ execution }) => {
  const executionPrompts = execution.data;
  const [prompts, setPrompts] = useState<DisplayPrompt[]>([]);
  const [htmlParts, setHtmlParts] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const sortAndProcessExecutions = async () => {
      const processedOutputs: DisplayPrompt[] = await Promise.all(
        executionPrompts.map(async exec => {
          const content = exec.message;
          return {
            content,
            prompt: exec.prompt,
            created_at: exec.created_at,
            isLoading: exec.isLoading,
            isCompleted: exec.isCompleted,
            isFailed: exec.isFailed,
          };
        }),
      );
      setPrompts(processedOutputs);
    };

    if (executionPrompts && executionPrompts.length > 0) {
      sortAndProcessExecutions();
    }
  }, [executionPrompts]);

  useEffect(() => {
    const processHtmlParts = async () => {
      const allHtmlParts = await Promise.all(
        prompts.map(async exec => {
          const content = exec.content;
          const parts = content.split(/(<antThinking>|<\/antThinking>|<antArtifact|<\/antArtifact>)/g);
          const renderedComponents: React.ReactNode[] = [];

          for (let i = 0; i < parts.length; i++) {
            const part = parts[i]?.trim();

            if (part === "<antThinking>") {
              let thinkingContent = "";
              while (i + 1 < parts.length && parts[i + 1] !== "</antThinking>") {
                thinkingContent += parts[++i];
              }
              if (i + 1 < parts.length && parts[i + 1] === "</antThinking>") {
                thinkingContent += parts[++i]; // Include closing tag
              }
              renderedComponents.push(
                <Suspense key={`thinking-${i}`}>
                  <AntThinkingComponent content={thinkingContent} />
                </Suspense>,
              );
            } else if (part.startsWith("<antArtifact")) {
              let artifactContent = part;
              while (i + 1 < parts.length && !parts[i + 1].startsWith("</antArtifact>")) {
                artifactContent += parts[++i];
              }
              if (i + 1 < parts.length && parts[i + 1].startsWith("</antArtifact>")) {
                artifactContent += parts[++i]; // Include closing tag
              }
              const title = (artifactContent.match(/title="([^"]*)"/) || [])[1];
              renderedComponents.push(
                <Suspense key={`artifact-${i}`}>
                  <AntArtifactComponent
                    title={title}
                    content={artifactContent}
                  />
                </Suspense>,
              );
            } else if (part && !part.startsWith("<")) {
              const _html = await markdownToHTML(part);
              renderedComponents.push(
                <ExecutionContent
                  key={i}
                  content={sanitizeHTML(_html)}
                />,
              );
            }
          }

          return renderedComponents;
        }),
      );

      setHtmlParts(allHtmlParts.flat());
    };

    if (prompts.length > 0) {
      processHtmlParts();
    }
  }, [prompts]);

  return (
    <Stack
      gap={1}
      className="vite"
      sx={{
        width: "-webkit-fill-available",
        my: "20px",
        p: { xs: "32px 8px 10px 8px", md: "32px" },
        bgcolor: "#F8F7FF",
        borderRadius: "0px 16px 16px 16px",
      }}
    >
      {execution && (
        <Stack
          py={{ xs: "10px", md: "20px" }}
          gap={4}
        >
          {execution.temp_title && (
            <Typography
              fontSize={{ xs: 18, md: 22 }}
              fontWeight={400}
            >
              {execution.temp_title}
            </Typography>
          )}
          <Stack gap={1}>{htmlParts}</Stack>
        </Stack>
      )}
    </Stack>
  );
};
