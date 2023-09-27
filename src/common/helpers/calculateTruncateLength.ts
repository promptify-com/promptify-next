import { MutableRefObject } from "react";

export const calculateTruncateLength = (containerRef: MutableRefObject<HTMLDivElement | null>) => {
  if (containerRef.current) {
    const containerWidth = containerRef.current.clientWidth;
    const maxLength = containerWidth / 50;
    return maxLength;
  }
  return 30;
};
