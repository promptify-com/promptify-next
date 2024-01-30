import ModeEdit from "@mui/icons-material/ModeEdit";
import PlayCircle from "@mui/icons-material/PlayCircle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { memo, useMemo, useRef, useState } from "react";
import Header from "./Header";
import StylerAccordion from "./StylerAccordion";
import { IEditPrompts } from "@/common/types/builder";
import { RenameForm } from "@/components/common/forms/RenameForm";
import Footer from "./Footer";
import HighlightTextarea from "../HighlightWithinTextarea";
import { Selection } from "react-highlight-within-textarea";
import { useDrag, useDrop, ConnectableElement } from "react-dnd";
import { getBuilderVarsPresets } from "@/common/helpers/getBuilderVarsPresets";
import { useDebouncedDispatch } from "@/hooks/useDebounceDispatch";
import { BUILDER_TYPE } from "@/common/constants";
import PromptTestDialog from "./PromptTest";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isDeepEqual } from "@/common/helpers";
import { useUpdatePromptMutation } from "@/core/api/templates";
import { setToast } from "@/core/store/toastSlice";

interface Props {
  prompt: IEditPrompts;
  order: number;
  setPrompt: (prompt: IEditPrompts) => void;
  deletePrompt: () => void;
  duplicatePrompt: () => void;
  prompts: IEditPrompts[];
  findPromptIndex: (id: number) => number;
  movePrompt: (id: number, atIndex: number) => void;
  builderType: BUILDER_TYPE;
}

const PromptCardAccordion = ({
  prompt,
  order,
  setPrompt,
  deletePrompt,
  duplicatePrompt,
  prompts,
  movePrompt,
  findPromptIndex,
  builderType,
}: Props) => {
  const initPromptData = useRef(prompt);
  const dispatch = useAppDispatch();
  const [promptData, setPromptData] = useState(prompt);
  const [renameAllow, setRenameAllow] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const saveNeeded = useRef(!promptData.id);
  const cursorPositionRef = useRef(0);
  const [highlightedOption, setHighlightedOption] = useState("");
  const { outputPresets, inputPresets } = useMemo(() => getBuilderVarsPresets(prompts, promptData, false), [prompts]);
  const { template, isTemplateOwner } = useAppSelector(state => state.builder);
  const isDraft = template?.status === "DRAFT";

  const [savePrompt] = useUpdatePromptMutation();

  const dispatchUpdatePrompt = useDebouncedDispatch(
    (prompt: IEditPrompts) => {
      setPrompt(prompt);
      if (isDraft && prompt.id) {
        savePrompt({ id: prompt.id, data: prompt });
      }
    },
    builderType === BUILDER_TYPE.USER ? 700 : 200,
  );

  const updatePrompt = (newPromptData: IEditPrompts) => {
    saveNeeded.current = !promptData.id || (!isDraft && !isDeepEqual(initPromptData.current, newPromptData));
    if (!isDeepEqual(promptData, newPromptData)) {
      setPromptData(newPromptData);
      dispatchUpdatePrompt(newPromptData);
    }
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

  const handleOpenTest = () => {
    if (saveNeeded.current) {
      dispatch(
        setToast({ message: "Please save your template changes first before running tests.", severity: "warning" }),
      );
      return;
    }
    dispatch(
      setToast({ message: "Please save your template changes first before running tests.", severity: "warning" }),
    );
  };

  return (
    <Box
      ref={(node: ConnectableElement) => preview(drop(node))}
      sx={{
        bgcolor: "surface.1",
        m: builderType === BUILDER_TYPE.ADMIN ? 0 : "24px 0 !important",
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
        dragPreview={(node: ConnectableElement) => drag(drop(node))}
        builderType={builderType}
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
              {isTemplateOwner && (
                <>
                  <Button
                    startIcon={<PlayCircle />}
                    onClick={handleOpenTest}
                    sx={{
                      fontSize: 13,
                      fontWeight: 500,
                      p: "4px 10px",
                    }}
                  >
                    Test run
                  </Button>
                  {showTest && (
                    <PromptTestDialog
                      open={showTest}
                      onClose={() => setShowTest(false)}
                      prompt={promptData}
                    />
                  )}
                </>
              )}
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
              highlightedValue={highlightedOption}
              setHighlightedValue={setHighlightedOption}
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
