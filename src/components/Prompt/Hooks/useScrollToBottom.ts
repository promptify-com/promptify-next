import { useAppSelector } from "@/hooks/useStore";
import { useState, useEffect, RefObject } from "react";
import { IMessage } from "@/components/Prompt/Types/chat";

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

  const handleUserScroll = () => {
    const container = ref.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 120;
    setShowScrollDown(!isAtBottom);
  };

  const scrollToBottom = (force?: boolean) => {
    const container = ref.current!;

    if (!force && (!container || skipScroll)) return;

    container.scrollTop = container.scrollHeight;
    setTimeout(handleUserScroll, 200);
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
  }, [content, generatedExecution, isGenerating]);

  return { showScrollDown, scrollToBottom };
};

export default useScrollToBottom;
