import { useState, useEffect } from "react";

export interface Props {
  text: string | File;
  shouldStream?: boolean;
  speed?: number;
  scrollToBottom?: () => void;
}

const useTextSimulationStreaming = ({ shouldStream = true, speed = 20, text, scrollToBottom }: Props) => {
  const chars = text instanceof File ? text.name.split("") : text.split("");

  const [streamedText, setStreamedText] = useState("");
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (!shouldStream || !text) {
      setHasFinished(true);
      setStreamedText(text instanceof File ? text.name : text ?? "");
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
