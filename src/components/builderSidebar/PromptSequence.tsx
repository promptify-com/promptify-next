import { memo, useCallback } from "react";
import { ConnectableElement, DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Menu from "@mui/icons-material/Menu";
import Edit from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { useScrollToElement } from "@/hooks/useScrollToElement";
import { promptComputeDomId } from "@/common/helpers";
import type { Engine } from "@/core/api/dto/templates";
import type { IEditPrompts } from "@/common/types/builder";

interface DraggableContentProps {
  prompt: IEditPrompts;
  engines: Engine[];
  findPromptIndex: (id: number) => number;
  movePrompt: (id: number, atIndex: number) => void;
}

interface PromptSequenceListProps {
  prompts: IEditPrompts[];
  setPrompts: (prompts: IEditPrompts[]) => void;
  engines: Engine[];
}

const DraggableContent = memo(({ prompt, findPromptIndex, movePrompt, engines }: DraggableContentProps) => {
  const setSmoothScrollTarget = useScrollToElement("smooth");

  const promptId = prompt.id! ?? prompt.temp_id;
  const promptEngine = engines?.find(engine => engine.id === prompt.engine_id);
  const originalIndex = findPromptIndex(promptId);

  const [{ isDragging }, drag, preview] = useDrag(
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
      },
    }),
    [promptId, originalIndex, movePrompt],
  );
  const scrollSmoothTo = () => {
    setSmoothScrollTarget(`#${promptComputeDomId(prompt)}`);
  };

  const [, drop] = useDrop(
    () => ({
      accept: "prompt",
      hover({ id: draggedId }: { id: number }) {
        if (draggedId !== promptId) {
          const overIndex = findPromptIndex(promptId);
          movePrompt(draggedId, overIndex);
        }
      },
    }),
    [findPromptIndex, movePrompt],
  );

  return (
    <Stack
      ref={(node: ConnectableElement) => preview(drop(node))}
      key={prompt.id}
      p={1}
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        userSelect: "none",
        borderRadius: "8px",
        border: isDragging ? "1px dashed var(--primary-main, #375CA9)" : "none",
        backgroundColor: isDragging ? "rgba(55, 92, 169, 0.08)" : "none",
      }}
      gap={2}
    >
      <Box ref={(node: ConnectableElement) => drag(drop(node))}>
        <Menu
          sx={{
            width: 24,
            height: 24,
            opacity: 0.3,
            cursor: "pointer",
            ":hover": {
              opacity: 1,
            },
          }}
        />
      </Box>
      <Stack
        direction={"row"}
        gap={2}
        flex={1}
        alignItems={"center"}
      >
        <img
          src={promptEngine?.icon}
          alt={promptEngine?.name}
          loading="lazy"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
          }}
        />
        <Stack>
          <Typography>{prompt.title}</Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              color: "text.secondary",
            }}
          >
            {promptEngine?.name}
          </Typography>
        </Stack>
      </Stack>
      <IconButton
        onClick={scrollSmoothTo}
        sx={{
          border: "none",
          "&:hover": {
            bgcolor: "surface.2",
          },
        }}
      >
        <Edit />
      </IconButton>
    </Stack>
  );
});

const PromptSequenceList = memo(({ prompts, setPrompts, engines }: PromptSequenceListProps) => {
  const [, drop] = useDrop(() => ({ accept: "prompt" }));
  const findPromptIndex = useCallback(
    (id: number) => {
      return prompts.findIndex(prompt => prompt.id === id || prompt.temp_id === id);
    },
    [prompts],
  );
  const movePrompt = useCallback(
    (id: number, atIndex: number) => {
      const index = findPromptIndex(id);
      const _promptsCopy = [...prompts];

      const targetPromptOrder = _promptsCopy.splice(index, 1);
      _promptsCopy.splice(atIndex, 0, targetPromptOrder[0]);

      const reorderedPrompts = _promptsCopy.map((prompt, index) => ({ ...prompt, order: index + 1 }));

      setPrompts(reorderedPrompts);
    },
    [findPromptIndex, prompts],
  );

  return (
    <Stack
      ref={drop}
      alignItems={"center"}
      gap={3}
      p={"16px 8px 24px"}
      bgcolor={"surface.1"}
    >
      {!!prompts.length && (
        <Stack width={"100%"}>
          {prompts.map((prompt, index) => {
            index++;
            return (
              <DraggableContent
                key={prompt.id}
                prompt={prompt}
                movePrompt={movePrompt}
                findPromptIndex={findPromptIndex}
                engines={engines}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
});

const PromptSequence = ({ prompts, setPrompts, engines }: PromptSequenceListProps) => {
  return (
    <Box
      bgcolor={"surface.1"}
      height={"96vh"}
      overflow={"hidden"}
      sx={{
        overflow: "auto",

        "&::-webkit-scrollbar": {
          width: "6px",
          p: 1,
          backgroundColor: "surface.2",
        },
        "&::-webkit-scrollbar-track": {
          webkitBoxShadow: "inset 3px 41px 16px gray",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "surface.5",
          outline: "1px solid surface.5",
          borderRadius: "10px",
        },
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <PromptSequenceList
          prompts={prompts}
          setPrompts={setPrompts}
          engines={engines}
        />
      </DndProvider>
    </Box>
  );
};

export default PromptSequence;
