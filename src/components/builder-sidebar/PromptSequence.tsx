import React, { useEffect, useState } from "react";

import { ConnectableElement, DndProvider } from "react-dnd";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Edit, Menu } from "@mui/icons-material";

import { HTML5Backend } from "react-dnd-html5-backend";
import { usePromptDragHandler } from "@/hooks/usePromptDragHandler";
import { IEditPrompts } from "@/common/types/builder";
import PromptItemPlaceholder from "./PromptItemPlaceholder";

interface DraggableContentProps {
  prompt: IEditPrompts;
  order: number;
  onStartDragging: () => void;
  onStopDragging: () => void;
}

const DraggableContent = ({ prompt, order, onStartDragging, onStopDragging }: DraggableContentProps) => {
  const promptId = prompt.id ?? prompt.temp_id ?? -1;

  const { drag, drop, engines, isDragging } = usePromptDragHandler(promptId);

  useEffect(() => {
    if (isDragging) {
      console.log("started");
      onStartDragging();
    } else {
      console.log("stoped");
      onStopDragging();
    }
  }, [isDragging]);

  const promptEngine = engines?.find(engine => engine.id === prompt.engine_id);

  return (
    <Stack
      ref={(node: ConnectableElement) => drag(drop(node))}
      key={prompt.id}
      p={1}
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        userSelect: "none",
      }}
      gap={2}
    >
      <Stack>
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
      </Stack>
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
        <Typography> Prompt #{order}</Typography>
      </Stack>
      <IconButton
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
};

const PromptSequenceList = () => {
  const [currentlyDraggingId, setCurrentlyDraggingId] = useState<number | null>(null);
  const { prompts, drop } = usePromptDragHandler(currentlyDraggingId!);

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
            const promptId = prompt.id ?? prompt.temp_id;
            if (promptId === currentlyDraggingId) {
              return <PromptItemPlaceholder key={prompt.id} />;
            }
            return (
              <DraggableContent
                key={prompt.id}
                prompt={prompt}
                order={index}
                //@ts-ignore
                onStartDragging={() => setCurrentlyDraggingId(prompt.id)}
                onStopDragging={() => setCurrentlyDraggingId(null)}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

const PromptSequence = () => {
  return (
    <Box>
      <DndProvider backend={HTML5Backend}>
        <PromptSequenceList />
      </DndProvider>
    </Box>
  );
};

export default PromptSequence;
