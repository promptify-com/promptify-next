import { MutableRefObject } from "react";

export const calculateTruncateLength = (containerRef: MutableRefObject<HTMLDivElement | null>) => {
  if (containerRef.current) {
    const containerWidth = containerRef.current.clientWidth;
    const maxLength = containerWidth / 10; //10 px for each character
    return maxLength;
  }
  return 30;
};
