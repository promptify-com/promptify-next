import { memo, useEffect, useState, lazy, Suspense } from "react";
import { markdownToHTML, sanitizeHTML } from "@/common/helpers/htmlHelper";
import { ExecutionContent } from "../common/ExecutionContent";
const AntThinkingComponent = lazy(() => import("@/components/GPT/AntThinking"));
const AntArtifactComponent = lazy(() => import("@/components/GPT/AntArtifact"));

interface Props {
  content: string;
  scrollToBottom?: () => void;
}

const MessageContentWithHTML = memo(({ content, scrollToBottom }: Props) => {
  const [htmlParts, setHtmlParts] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!content) return;

    const generateFinalHtml = async () => {
      // Split by <antThinking> and <antArtifact> tags
      const parts = content.split(/(<\/?antThinking>|<\/?antArtifact)/g);
      const renderedComponents: React.ReactNode[] = [];

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]?.trim();

        // Detect and render <antThinking>
        if (part.startsWith("<antThinking>")) {
          const content = parts[++i]?.trim();
          renderedComponents.push(
            <Suspense key={`thinking-${i}`}>
              <div id={`thinking-${i}`}>
                <AntThinkingComponent content={content} />
              </div>
            </Suspense>,
          );
        }
        // Detect and render <antArtifact>
        else if (part.startsWith("<antArtifact")) {
          const content = parts[++i]?.trim();
          const title = (content.match(/title="([^"]*)"/) || [])[1];
          renderedComponents.push(
            <Suspense key={`artifact-${i}`}>
              <div id={`artifact-${i}`}>
                <AntArtifactComponent
                  title={title}
                  content={content}
                />
              </div>
            </Suspense>,
          );
        }
        // Apply HTML transformation to parts without the special tags
        else if (part && !part.startsWith("<")) {
          const _html = await markdownToHTML(part);
          renderedComponents.push(
            <ExecutionContent
              key={i}
              content={sanitizeHTML(_html)}
            />,
          );
        }
      }

      setHtmlParts(renderedComponents);
    };

    generateFinalHtml();
    scrollToBottom?.();
  }, [content]);

  return htmlParts;
});

export default MessageContentWithHTML;
