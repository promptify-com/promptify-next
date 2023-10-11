import { useCallback, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useAppDispatch, useAppSelector } from "./useStore";
import { handlePrompts } from "@/core/store/builderSlice";

export function usePromptDragHandler(promptId: number) {
  const dispatch = useAppDispatch();
  const globalPrompts = useAppSelector(state => state.builder.prompts);
  const engines = useAppSelector(state => state.builder.engines);

  const [localPrompts, setLocalPrompts] = useState(globalPrompts);

  const findPromptIndex = useCallback(
    (id: number) => {
      return localPrompts.findIndex(prompt => prompt.id === id || prompt.temp_id === id);
    },
    [localPrompts],
  );

  const originalIndex = findPromptIndex(promptId);

  const movePrompt = useCallback(
    (id: number, atIndex: number) => {
      const index = findPromptIndex(id);
      let _prompts = localPrompts.slice();

      const targetPromptOrder = _prompts.splice(index, 1);
      _prompts.splice(atIndex, 0, targetPromptOrder[0]);

      _prompts = _prompts.map((prompt, index) => ({ ...prompt, order: index + 1 }));

      setLocalPrompts(_prompts);
    },
    [findPromptIndex, localPrompts],
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "prompt",
      item: { id: promptId, originalIndex },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          movePrompt(droppedId, originalIndex);
        }
        dispatch(handlePrompts(localPrompts));
      },
    }),
    [promptId, originalIndex, movePrompt],
  );

  const [, drop] = useDrop(
    () => ({
      accept: "prompt",
      hover({ id: draggedId }: { id: number }) {
        if (draggedId === promptId) return;
        const overIndex = findPromptIndex(promptId);
        movePrompt(draggedId, overIndex);
      },
    }),
    [movePrompt, findPromptIndex],
  );

  return { drop, drag, isDragging, prompts: globalPrompts, engines };
}
