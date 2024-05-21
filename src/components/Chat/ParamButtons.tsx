import { useState, MouseEvent, useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import type { PromptParams } from "@/core/api/dto/prompts";
import { updateParameterSelection, initialState as initialChatState } from "@/core/store/chatSlice";

interface Props {
  param: PromptParams;
  onChange: (value: number) => void;
}

const ParamButtons = ({ param, onChange }: Props) => {
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const answers = useAppSelector(state => state.chat?.answers ?? initialChatState.answers);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setOpenIndex(index);
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpenIndex(null);
    setPopoverOpen(false);
  };
  function extractFirstKeyword(description: string): string {
    const match = description.match(/^([^:]+):/);
    return match ? match[1].trim() : "";
  }

  const answer = answers.find(answer => answer.inputName === param.parameter.name);

  return (
    <Stack
      direction="row"
      gap={2}
    >
      <div
        ref={containerRef}
        style={{ position: "relative", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}
      >
        {param.parameter.score_descriptions.map((score, index) => {
          const keyword = extractFirstKeyword(score.description);
          return (
            <div key={index}>
              <Box
                key={index}
                onMouseEnter={e => handlePopoverOpen(e, index)}
                onMouseLeave={handlePopoverClose}
                onClick={() => {
                  if (!!answer) {
                    return;
                  }
                  onChange(score.score);
                  dispatch(updateParameterSelection(keyword));
                }}
              >
                <Button
                  variant="outlined"
                  disabled={!!answer}
                  sx={{
                    color: answer?.answer === score.score ? "onPrimary" : "primary.main",
                    bgcolor: answer?.answer === score.score ? "primary.main" : "transparent",
                    "&:hover": {
                      border: "1px solid",
                      borderColor: "primary.main",
                      color: "primary.main",
                      bgcolor: "action.hover",
                    },
                    "&:disabled": {
                      color: answer?.answer === score.score ? "onPrimary" : "gray",
                    },
                  }}
                >
                  {`${index + 1}- ${keyword}`}
                </Button>
              </Box>
              {openIndex === index && !!!answer && (
                <Popover
                  id="mouse-over-popover"
                  open={popoverOpen}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                  sx={{
                    pointerEvents: "none",
                  }}
                  PaperProps={{
                    sx: {
                      marginTop: -7,
                      borderRadius: "24px",
                      pointerEvents: "auto",
                    },
                  }}
                  container={containerRef.current}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Stack
                    width={"200px"}
                    p={"16px 24px"}
                    textAlign={"center"}
                    gap={2}
                  >
                    <Typography
                      sx={{
                        color: "primary.main",
                      }}
                    >
                      {param.parameter.name}
                    </Typography>
                    <Stack gap={1}>
                      <Typography
                        fontSize={18}
                        fontWeight={400}
                      >
                        {keyword}
                      </Typography>
                      <Typography
                        fontSize={14}
                        fontWeight={400}
                      >
                        {score.description.slice(keyword.length + 1)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Popover>
              )}
            </div>
          );
        })}
      </div>
    </Stack>
  );
};

export default ParamButtons;
