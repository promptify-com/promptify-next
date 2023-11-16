import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { Dispatch, SetStateAction, memo, useEffect } from "react";

interface StreamContentProps {
  content: string;
  shouldStream: boolean;
  setIsSimulationStreaming: Dispatch<SetStateAction<boolean>>;
  onStreamingFinished: () => void;
  speed?: number;
}

export const StreamContent = memo(
  ({ content, shouldStream, setIsSimulationStreaming, onStreamingFinished, speed }: StreamContentProps) => {
    const { streamedText, hasFinished } = useTextSimulationStreaming({
      text: content,
      shouldStream,
      speed,
    });

    useEffect(() => {
      if (hasFinished) {
        onStreamingFinished();
        setIsSimulationStreaming(false);
      }
    }, [hasFinished]);

    return <>{streamedText}</>;
  },
);
