import { useState, useEffect } from "react";

export interface Props {
  text: string;
  shouldStream?: boolean;
  speed?: number;
  scrollToBottom?: () => void;
}

const useTextSimulationStreaming = ({ shouldStream = true, speed = 20, text, scrollToBottom }: Props) => {
  const chars = text.split("");
  const [streamedText, setStreamedText] = useState("");
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (!shouldStream || !text) {
      setHasFinished(true);
      setStreamedText(text ?? "");
      return;
    }

    const timerId = setInterval(() => {
      if (!chars.length) {
        clearInterval(timerId);
        setHasFinished(true);
        return;
      }

      setStreamedText(prevChars => prevChars + chars.shift());
      scrollToBottom?.();
    }, speed);
  }, []);

  return { streamedText, hasFinished };
};

export default useTextSimulationStreaming;
