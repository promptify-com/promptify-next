import { setIsSimulationStreaming } from "@/core/store/chatSlice";
import { useAppDispatch } from "@/hooks/useStore";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { memo, useEffect } from "react";

interface StreamContentProps {
  content: string;
  shouldStream: boolean;
  onStreamingFinished: () => void;
  speed?: number;
}

export const StreamContent = memo(({ content, shouldStream, onStreamingFinished, speed }: StreamContentProps) => {
  const dispatch = useAppDispatch();
  const { streamedText, hasFinished } = useTextSimulationStreaming({
    text: content,
    shouldStream,
    speed,
  });

  useEffect(() => {
    if (hasFinished) {
      onStreamingFinished();
      dispatch(setIsSimulationStreaming(false));
    }
  }, [hasFinished]);

  return <>{streamedText}</>;
});
