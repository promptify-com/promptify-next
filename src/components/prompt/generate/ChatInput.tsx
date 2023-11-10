import React, { useRef, useState } from "react";
import { Clear, Edit, PlayCircle } from "@mui/icons-material";
import { Box, Button, Chip, Grid, Popover, Stack } from "@mui/material";
import { IAnswer } from "@/common/types/chat";
import { useAppSelector } from "@/hooks/useStore";
import ThreeDotsAnimation from "@/components/design-system/ThreeDotsAnimation";
import useTruncate from "@/hooks/useTruncate";
import { calculateTruncateLength } from "@/common/helpers/calculateTruncateLength";
import { addSpaceBetweenCapitalized } from "@/common/helpers";
import MessageSender from "./MessageSender";
import { useDispatch } from "react-redux";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import { setGeneratingStatus } from "@/core/store/templatesSlice";
import { GeneratingProgressCard } from "@/components/common/cards/GeneratingProgressCard";

interface ChatInputProps {
  answers: IAnswer[];
  onAnswerClear: (answer: IAnswer) => void;
  onSubmit: (value: string) => void;
  disabled: boolean;
  disabledTags: boolean;
  onVary: () => void;
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
  disabledButton: boolean;
  abortGenerating: () => void;
}

export const ChatInput = ({
  onSubmit,
  disabled,
  answers,
  onAnswerClear,
  disabledTags,
  onVary,
  onGenerate,
  showGenerate,
  isValidating,
  disabledButton,
  abortGenerating,
}: ChatInputProps) => {
  const { truncate } = useTruncate();
  const dispatch = useDispatch();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const isFullScreen = useAppSelector(state => state.template.isChatFullScreen);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getAnswerName = (answer: IAnswer) => {
    const totalLength = calculateTruncateLength(containerRef);
    const inputNameAllocatedLength = Math.floor(0.4 * totalLength);
    const answerAllocatedLength = totalLength - inputNameAllocatedLength;

    const truncatedInputName = truncate(addSpaceBetweenCapitalized(answer.inputName), {
      length: inputNameAllocatedLength,
    });
    const name = answer.answer instanceof File ? answer.answer.name : answer.answer;
    const truncatedAnswer = truncate(name.toString(), { length: answerAllocatedLength });

    return `${truncatedInputName}: ${truncatedAnswer}`;
  };

  const abortConnection = () => {
    abortGenerating();
    dispatch(setGeneratedExecution(null));
    dispatch(setGeneratingStatus(false));
  };

  return (
    <Grid
      ref={containerRef}
      mx={"40px"}
      mb={"16px"}
      position={"relative"}
      display={"flex"}
      flexDirection={"column"}
      gap={"8px"}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"start"}
      >
        <ThreeDotsAnimation loading={isValidating} />
        {showGenerate && !isGenerating && (
          <Button
            onClick={onGenerate}
            endIcon={
              <PlayCircle
                sx={{ color: "onPrimary" }}
                fontSize={"small"}
              />
            }
            sx={{
              bgcolor: "primary.main",
              borderColor: "primary.main",
              borderRadius: "999px",
              height: "22px",
              p: "15px",
              ml: "0px",
              color: "15px",
              fontWeight: 500,
              ":hover": {
                opacity: 0.9,
                bgcolor: "primary.main",
                color: "onPrimary",
              },
            }}
            variant="contained"
            disabled={isGenerating || isValidating || disabledButton}
          >
            Run prompt
          </Button>
        )}
        {isGenerating && <GeneratingProgressCard onCancel={abortConnection} />}
      </Box>

      {answers.length > 0 && (
        <Grid
          display={"flex"}
          alignItems={{ xs: "start", md: "center" }}
          flexWrap={"wrap"}
          gap={"8px"}
        >
          {answers.slice(0, 3).map(answer => (
            <Button
              onClick={() => onAnswerClear(answer)}
              disabled={disabledTags}
              key={answer.inputName}
              startIcon={
                <Clear
                  sx={{
                    opacity: 0.5,
                  }}
                />
              }
              variant="contained"
              sx={{
                p: "1px 10px",
                fontSize: 15,
                fontWeight: "500",
                borderBottomRightRadius: "4px",
                borderTopRightRadius: "4px",
                whiteSpace: "pre-wrap",
                bgcolor: "surface.3",
                color: "onSurface",
                borderColor: "surface.3",
                ":hover": {
                  bgcolor: "surface.5",
                  color: "onSurface",
                },
              }}
            >
              {getAnswerName(answer)}
            </Button>
          ))}
          {answers.length > 3 && (
            <Grid
              display={"flex"}
              alignItems={"center"}
              flexWrap={"wrap"}
              gap={"8px"}
            >
              <Chip
                label="+"
                onClick={e => setAnchorEl(e.currentTarget)}
                sx={{
                  bgcolor: "surface.3",
                  color: "onSurface",
                  borderColor: "surface.3",
                  ":hover": {
                    bgcolor: "surface.5",
                    color: "onSurface",
                  },
                }}
                size="small"
              />
              {anchorEl && (
                <Popover
                  open
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Stack
                    alignItems={"flex-start"}
                    p={1}
                    gap={0.5}
                  >
                    {answers.slice(3).map(answer => (
                      <Button
                        onClick={() => onAnswerClear(answer)}
                        disabled={disabledTags}
                        key={answer.inputName}
                        startIcon={
                          <Clear
                            sx={{
                              opacity: 0.5,
                            }}
                          />
                        }
                        variant="contained"
                        sx={{
                          p: "1px 10px",
                          fontSize: 15,
                          fontWeight: "500",
                          borderBottomRightRadius: "4px",
                          borderTopRightRadius: "4px",
                          bgcolor: "surface.3",
                          color: "onSurface",
                          borderColor: "surface.3",
                          ":hover": {
                            bgcolor: "surface.5",
                            color: "onSurface",
                          },
                        }}
                      >
                        {getAnswerName(answer)}
                      </Button>
                    ))}
                  </Stack>
                </Popover>
              )}
            </Grid>
          )}
          <Button
            variant="text"
            startIcon={<Edit />}
            sx={{
              border: "1px solid",
              height: "22px",
              p: "15px",
              fontSize: 13,
              fontWeight: 500,
              ":hover": {
                bgcolor: "action.hover",
              },
            }}
            onClick={onVary}
          >
            Vary
          </Button>
        </Grid>
      )}

      <MessageSender
        onSubmit={onSubmit}
        disabled={disabled}
      />
    </Grid>
  );
};
