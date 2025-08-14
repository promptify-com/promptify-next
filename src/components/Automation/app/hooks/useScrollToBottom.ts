import { useState, useEffect, useRef, useCallback } from "react";
import type { RefObject } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { IMessage } from "../../ChatInterface/types";

const useScrollToBottom = ({
  ref,
  content,
  skipScroll = false,
}: {
  ref: RefObject<HTMLDivElement>;
  content: IMessage[];
  skipScroll?: boolean;
}) => {
  const generatedExecution = useAppSelector(state => state.executions?.generatedExecution ?? null);
  const isGenerating = useAppSelector(state => state.template?.isGenerating ?? false);
  const lastScrollHeight = useRef(0);
  const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
  const userHasScrolledUp = useRef<boolean>(false);

  const scrollToBottom = useCallback(
    (force = false) => {
      const container = ref.current;

      if (!container) return;

      if (!force && (skipScroll || (isGenerating && userHasScrolledUp.current))) return;

      container.scrollTop = container.scrollHeight;
    },
    [skipScroll, isGenerating],
  );

  useEffect(() => {
    const container = ref.current;

    if (!container) return;

    const handleUserScroll = () => {
      const container = ref.current;

      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 40;

      userHasScrolledUp.current = !isAtBottom;
      setShowScrollDown(!isAtBottom);
    };

    container.addEventListener("scroll", handleUserScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleUserScroll);
    };
  }, [ref]);

  useEffect(() => {
    if (ref.current) {
      const shouldScroll = ref.current.scrollHeight !== lastScrollHeight.current && !showScrollDown;

      if (shouldScroll) {
        ref.current.scrollTop = ref.current.scrollHeight;
        lastScrollHeight.current = ref.current.scrollHeight;
      }
    }
  }, [content, generatedExecution?.data, isGenerating]);

  return { showScrollDown, scrollToBottom };
};

export default useScrollToBottom;
