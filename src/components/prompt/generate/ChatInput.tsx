import React from "react";
import { Clear, Edit, PlayCircle, Send } from "@mui/icons-material";
import { Box, Button, CircularProgress, Grid, InputBase, Typography } from "@mui/material";

import { IAnswer } from "@/common/types/chat";
import { useAppSelector } from "@/hooks/useStore";
import ThreeDotsAnimation from "@/components/design-system/ThreeDotsAnimation";
import { addSpaceBetweenCapitalized } from "@/common/helpers";

interface ChatInputProps {
  onChange: (str: string) => void;
  answers: IAnswer[];
  onAnswerClear: (answer: IAnswer) => void;
  value: string;
  onSubmit: () => void;
  disabled: boolean;
  disabledTags: boolean;
  onVary: () => void;
  onGenerate: () => void;
  showGenerate: boolean;
  isValidating: boolean;
}

export const ChatInput = ({
  onChange,
  value,
  onSubmit,
  disabled,
  answers,
  onAnswerClear,
  disabledTags,
  onVary,
  onGenerate,
  showGenerate,
  isValidating,
}: ChatInputProps) => {
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  return (
    <Grid
      p={"0px 16px"}
      pb={"16px"}
      position={"relative"}
      width={"100%"}
      left={0}
      display={"flex"}
      flexDirection={"column"}
      gap={"8px"}
      right={0}
      mt={"auto"}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"start"}
      >
        <ThreeDotsAnimation loading={isValidating} />
        {showGenerate && (
          <Button
            onClick={onGenerate}
            startIcon={
              isGenerating ? (
                <CircularProgress size={16} />
              ) : (
                <PlayCircle
                  sx={{ color: "onPrimary" }}
                  fontSize={"small"}
                />
              )
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
            disabled={isGenerating || isValidating}
          >
            {isGenerating ? (
              <Typography>Generation in progress...</Typography>
            ) : (
              <>
                <Typography sx={{ color: "inherit", fontSize: 15, lineHeight: "22px" }}>Generate</Typography>
                <Typography sx={{ ml: 1.5, color: "inherit", fontSize: 12 }}>~360s</Typography>
              </>
            )}
          </Button>
        )}
      </Box>

      {answers.length > 0 && (
        <Grid
          display={"flex"}
          alignItems={"flex-start"}
          alignContent={"flex-start"}
          alignSelf={"stretch"}
          flexWrap={"wrap"}
          gap={"8px"}
        >
          {answers.map(answer => (
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
              {addSpaceBetweenCapitalized(answer.inputName)} : {answer.answer}
            </Button>
          ))}
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
            disabled={disabledTags}
            onClick={onVary}
          >
            Vary
          </Button>
        </Grid>
      )}
      <Box
        bgcolor={"surface.3"}
        display={"flex"}
        alignItems={"center"}
        borderRadius="99px"
        minHeight={"32px"}
        p={"8px 16px"}
      >
        <InputBase
          multiline
          disabled={disabled}
          fullWidth
          sx={{
            ml: 1,
            flex: 1,
            fontSize: 13,
            p: "3px",
            lineHeight: "22px",
            letterSpacing: "0.46px",
            fontWeight: "500",
            maxHeight: "60px",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "3px",
              p: 1,
              backgroundColor: "surface.5",
            },
            "&::-webkit-scrollbar-track": {
              webkitBoxShadow: "inset 0 0 16px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "surface.3",
              outline: "1px solid surface.1",
              borderRadius: "10px",
            },
            ".Mui-disabled": {
              cursor: disabled ? "not-allowed" : "auto",
            },
          }}
          placeholder="Chat with Promptify"
          inputProps={{ "aria-label": "Name" }}
          onChange={e => onChange(e.target.value)}
          value={value}
          onKeyPress={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <Send
          onClick={onSubmit}
          sx={{
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
      </Box>
    </Grid>
  );
};
