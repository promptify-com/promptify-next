import ModeEdit from "@mui/icons-material/ModeEdit";
import PlayCircle from "@mui/icons-material/PlayCircle";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React, { memo, useMemo, useRef, useState } from "react";
import { Header } from "./Header";
import { StylerAccordion } from "./StylerAccordion";
import { IEditPrompts } from "@/common/types/builder";
import { RenameForm } from "@/components/common/forms/RenameForm";
import { Footer } from "./Footer";
import { HighlightTextarea } from "../HighlightWithinTextarea";
import { Selection } from "react-highlight-within-textarea";
import { Engine } from "@/core/api/dto/templates";
import { useDrag, useDrop, ConnectableElement } from "react-dnd";
import { getBuilderVarsPresets } from "@/common/helpers/getBuilderVarsPresets";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";

interface Props {
  prompt: IEditPrompts;
  order: number;
  setPrompt: (prompt: IEditPrompts) => void;
  deletePrompt: () => void;
  duplicatePrompt: () => void;
  prompts: IEditPrompts[];
  engines: Engine[];
  findPromptIndex: (id: number) => number;
  movePrompt: (id: number, atIndex: number) => void;
}

const PromptCardAccordion = ({
  prompt,
  order,
  setPrompt,
  deletePrompt,
  duplicatePrompt,
  prompts,
  engines,
  movePrompt,
  findPromptIndex,
}: Props) => {
  const [promptData, setPromptData] = useState(prompt);
  const [renameAllow, setRenameAllow] = useState(false);
  const cursorPositionRef = useRef(0);
  const [highlightedOption, setHighlitedOption] = useState("");

  const { outputPresets, inputPresets } = useMemo(() => getBuilderVarsPresets(prompts, promptData, false), [prompts]);

  const dispatchUpdatePrompt = useDebouncedDispatch((prompt: IEditPrompts) => {
    setPrompt(prompt);
  }, 700);

  const updatePrompt = (newPromptData: IEditPrompts) => {
    setPromptData(newPromptData);
    dispatchUpdatePrompt(newPromptData);
  };

  const contentHandler = (content: string, selection?: Selection) => {
    const { focus } = selection ?? {};
    if (focus) {
      cursorPositionRef.current = focus;
    }
    updatePrompt({
      ...promptData,
      content,
    });
  };

  const promptId = prompt.id! ?? prompt.temp_id;
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
    <Box
      ref={(node: ConnectableElement) => preview(drop(node))}
      sx={{
        bgcolor: "surface.1",
        m: "24px 0 !important",
        borderRadius: "16px !important",
        boxShadow: "none",
        transition: "box-shadow 0.3s ease-in-out",
        ":before": { display: "none" },
        ":hover": {
          boxShadow:
            "0px 3px 3px -2px rgba(225, 226, 236, 0.20), 0px 3px 4px 0px rgba(225, 226, 236, 0.14), 0px 1px 8px 0px rgba(27, 27, 30, 0.12)",
        },
        opacity: isDragging ? 0 : 1,
      }}
    >
      <Header
        prompt={promptData}
        order={order}
        setPrompt={updatePrompt}
        deletePrompt={deletePrompt}
        duplicatePrompt={duplicatePrompt}
        engines={engines}
        dragPreview={(node: ConnectableElement) => drag(drop(node))}
      />
      <Divider sx={{ borderColor: "surface.3" }} />
      <Box
        sx={{
          p: 0,
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={"8px 16px 8px 24px"}
        >
          {!renameAllow ? (
            <>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                sx={{
                  opacity: 0.5,
                  ":hover": {
                    opacity: 1,
                  },
                }}
              >
                <Typography sx={{ color: "onSurface", fontSize: 14, fontWeight: 500 }}>
                  {promptData.title || ""}
                </Typography>
                <ModeEdit
                  sx={{ cursor: "pointer", fontSize: "16px" }}
                  onClick={() => setRenameAllow(true)}
                />
              </Stack>
              <Button startIcon={<PlayCircle />}>Test run</Button>
            </>
          ) : (
            <RenameForm
              label="Prompt"
              initialValue={promptData.title}
              onSave={val => {
                updatePrompt({ ...promptData, title: val });
                setRenameAllow(false);
              }}
              onCancel={() => setRenameAllow(false)}
            />
          )}
        </Stack>
        <Box p={"8px 16px 8px 24px"}>
          <Typography
            sx={{
              py: "8px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Prompt Instructions:
          </Typography>
          <Box
            sx={{
              height: "250px",
              maxHeight: "25svh",
              py: "12px",
              position: "relative",
            }}
          >
            <HighlightTextarea
              prompt={promptData}
              cursorPositionRef={cursorPositionRef}
              onChange={contentHandler}
              outputPresets={outputPresets}
              inputPresets={inputPresets}
              highlitedValue={highlightedOption}
              setHighlitedValue={setHighlitedOption}
              type={"user"}
            />
          </Box>
        </Box>

        <StylerAccordion
          prompt={promptData}
          setPrompt={updatePrompt}
        />

        <Footer
          prompt={promptData}
          setPrompt={updatePrompt}
        />
      </Box>
    </Box>
  );
};

export default memo(PromptCardAccordion);
