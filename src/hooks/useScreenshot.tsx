import { useCallback, useState } from "react";
import html2canvas from "html2canvas";

const useScreenshot = (targetId: string) => {
  const [images, setImages] = useState<Record<string, string>>({});

  const captureScreenshots = useCallback(async () => {
    const targetElements = document.querySelectorAll(`[id^="${targetId}"]`);
    const capturedImages: Record<string, string> = {}; // Use an object for key-value pairs

    for (const targetElement of targetElements) {
      try {
        const canvas = await html2canvas(targetElement as HTMLElement);
        const imgData = canvas.toDataURL("image/png");
        capturedImages[targetElement.id] = imgData;
      } catch (error) {
        console.error("Error capturing screenshot:", error);
      }
    }

    setImages(capturedImages);
    return capturedImages;
  }, [targetId]);

  return { images, captureScreenshots };
};

export default useScreenshot;
