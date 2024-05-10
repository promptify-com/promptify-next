import { useState, useEffect, useRef, type RefObject } from "react";
import { useAppSelector } from "@/hooks/useStore";
import type { IMessage } from "@/components/Prompt/Types/chat";

const useScrollToBottom = ({
  ref,
  content,
  skipScroll = false,
}: {
  ref: RefObject<HTMLDivElement>;
  content?: IMessage[] | string;
  skipScroll?: boolean;
}) => {
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
  const userHasScrolledUp = useRef<boolean>(false);

  const handleUserScroll = () => {
    const container = ref.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    userHasScrolledUp.current = !isAtBottom;
    setShowScrollDown(!isAtBottom);
  };

  const scrollToBottom = (force?: boolean) => {
    const container = ref.current;
    if ((!force && (!container || skipScroll || userHasScrolledUp.current)) || !container) return;

    container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.addEventListener("scroll", handleUserScroll);
    return () => container.removeEventListener("scroll", handleUserScroll);
  }, [ref]);

  useEffect(() => {
    if (!showScrollDown) {
      scrollToBottom();
    }
  }, [content, generatedExecution?.data, isGenerating]);

  return { showScrollDown, scrollToBottom };
};

export default useScrollToBottom;
