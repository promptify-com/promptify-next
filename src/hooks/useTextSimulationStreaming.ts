import { useState, useEffect } from "react";

export interface Props {
  text: string;
  shouldStream?: boolean;
  speed?: number;
}

const useTextSimulationStreaming = ({ shouldStream = true, speed = 20, text }: Props) => {
  if (!shouldStream || !text) {
    return { streamedText: text };
  }

  const chars = text.split("");
  const [streamedText, setStreamedText] = useState("");
  const [hasFinished, setFinished] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!chars.length) {
        clearInterval(timerId);
        setFinished(true);
        return;
      }

      setStreamedText(prevChars => prevChars + chars.shift());
    }, speed);
  }, []);

  return { streamedText, hasFinished };
};

export default useTextSimulationStreaming;
