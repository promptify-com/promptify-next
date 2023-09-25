import { HighlightWithinTextareaRef } from "@/common/types/builder";
import { useState, useEffect } from "react";

type CursorPosition = {
  x: number;
  y: number;
};

// Define a custom interface for divRef.current

export function useCursorPosition(
  divRef: React.RefObject<HighlightWithinTextareaRef>,
  isSuggestionListVisible: boolean,
) {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(null);

  useEffect(() => {
    function handleCursorPositionChange() {
      if (isSuggestionListVisible) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          //@ts-ignore
          const divRect = divRef.current.editorContainer.getBoundingClientRect();
          const maxX = Math.min(rect.left - divRect.left, divRect.width - 170);
          const cursorCoordinates = {
            x: maxX,
            y: rect.top - divRect.top + rect.height + 30,
          };

          setCursorPosition(cursorCoordinates);
        }
      }
    }

    if (isSuggestionListVisible && divRef.current) {
      handleCursorPositionChange();
    }
  }, [isSuggestionListVisible]);

  return cursorPosition;
}
