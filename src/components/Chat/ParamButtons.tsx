import { useState, Fragment, MouseEvent, useEffect } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";

import { useAppSelector } from "@/hooks/useStore";
import type { PromptParams } from "@/core/api/dto/prompts";

interface Props {
  param: PromptParams;
  onChange: (value: number) => void;
}

const ParamButtons = ({ param, onChange }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const answers = useAppSelector(state => state.chat.answers);

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

  useEffect(() => {
    console.log(anchorEl, openIndex);
  }, [anchorEl, openIndex]);

  return (
    <Stack
      direction="row"
      gap={2}
    >
      {param.parameter.score_descriptions.map((score, index) => {
        const keyword = extractFirstKeyword(score.description);
        return (
          <Fragment key={index}>
            <Box
              key={index}
              onMouseEnter={e => handlePopoverOpen(e, index)}
              onClick={() => onChange(score.score)}
              zIndex={4444}
              aria-owns={popoverOpen ? "mouse-over-popover" : undefined}
              aria-haspopup="true"
            >
              <Button
                variant="outlined"
                sx={{
                  color: answer?.answer === score.score ? "onPrimary" : "primary.main",
                  bgcolor: answer?.answer === score.score ? "primary.main" : "transparent",
                  "&:hover": {
                    border: "1px solid",
                    borderColor: "primary.main",
                    color: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                {`${index + 1}- ${keyword}`}
              </Button>
            </Box>
            {openIndex === index && (
              <Popover
                id="mouse-over-popover"
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                disableRestoreFocus
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{
                  mt: -4,
                  zIndex: 1,
                  borderRadius: "24px",
                  overflow: "hidden",
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
          </Fragment>
        );
      })}
    </Stack>
  );
};

export default ParamButtons;
