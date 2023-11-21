import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "@/hooks/useStore";
import Add from "@mui/icons-material/Add";
import HighlightOff from "@mui/icons-material/HighlightOff";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import PlayCircle from "@mui/icons-material/PlayCircle";
import AvatarWithInitials from "../AvatarWithInitials";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { DeleteOutline, ShareOutlined, StarOutline } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";

interface Props {
  mode: "execution" | "input";
  isExpanded: boolean;
  onGenerate: () => void;
  onCancel: () => void;
  onClear: () => void;
  showClear: boolean;
  showGenerate: boolean;
  changeMode: (mode: "execution" | "input") => void;
  executionTitle?: string;
}

function AccordionMessageHeader({
  mode,
  isExpanded,
  onGenerate,
  onClear,
  showClear,
  onCancel,
  showGenerate,
  changeMode,
  executionTitle,
}: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  return (
    <AccordionSummary
      sx={{
        mb: -4,
        bgcolor: "surface.2",
        borderRadius: "0px 16px 16px 16px",
      }}
    >
      <Stack
        direction={"row"}
        gap={"8px"}
        width={"100%"}
        alignItems={"center"}
      >
        {mode === "execution" && (
          <>
            {isGenerating ? (
              <CircularProgress
                size={42}
                sx={{
                  color: "grey.400",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <AvatarWithInitials title="Test Title" />
            )}
          </>
        )}

        {mode === "input" && (
          <Box
            position={"relative"}
            mt={0.5}
            sx={{
              padding: "4px",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              border: "1px dashed #375CA9 ",
              bgcolor: "#375CA91A",
              color: "#375CA9",
            }}
          >
            <Add
              sx={{
                fontSize: 32,
              }}
            />
            <Box
              position={"absolute"}
              width={"13px"}
              height={"13px"}
              borderRadius={"4px 0px 8px 0px"}
              bgcolor={"surface.1"}
              bottom={0}
              right={0}
            />
          </Box>
        )}

        <Stack
          flex={1}
          direction={"column"}
          gap={"2px"}
        >
          <Typography
            fontSize={"15px"}
            lineHeight={"120%"}
            letterSpacing={"0.2px"}
          >
            {mode === "input" && "New Prompt"}

            {mode === "execution" && <>{isGenerating ? "Generation in progress..." : executionTitle ?? "Untitled"}</>}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              lineHeight: "143%",
              letterSpacing: "0.17px",
              opacity: 0.7,
            }}
          >
            {mode === "input" && "About 360s generation time"}
            {mode === "execution" && <>{isGenerating ? "About 360s Left" : "Text with markup. 12k words, 3 images"}</>}
          </Typography>
        </Stack>

        {mode === "input" && isExpanded && (
          <Stack
            direction={"row"}
            gap={1}
            alignItems={"center"}
          >
            {showClear && (
              <Button
                onClick={e => {
                  e.stopPropagation();
                  onClear();
                }}
                endIcon={<Close />}
                sx={{
                  height: "20px",
                  p: "15px",
                  color: "onSurface",
                  fontSize: 15,
                  fontWeight: 500,
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
                variant="text"
              >
                Clear
              </Button>
            )}

            <Button
              onClick={event => {
                event.stopPropagation();
                changeMode("execution");
                onGenerate();
              }}
              endIcon={<PlayCircle />}
              sx={{
                height: "22px",
                p: "15px",
                fontSize: 15,
                opacity: showGenerate ? 1 : 0.4,
                lineHeight: "110%",
                letterSpacing: "0.2px",
                fontWeight: 500,
                color: showGenerate ? "primary" : "onSurface",
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
              variant={showGenerate ? "contained" : "text"}
              disabled={!showGenerate}
            >
              Run prompts
            </Button>
          </Stack>
        )}

        {mode === "execution" && (
          <>
            {isGenerating ? (
              <Button
                onClick={onCancel}
                endIcon={<HighlightOff />}
                sx={{
                  height: "22px",
                  p: "15px",
                  color: "onSurface",
                  fontSize: 13,
                  fontWeight: 500,
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
                variant="text"
              >
                Cancel
              </Button>
            ) : (
              <Stack
                direction={"row"}
                gap={"8px"}
              >
                <Tooltip
                  title="Save"
                  placement="top"
                >
                  <IconButton
                    sx={{
                      border: "none",
                    }}
                  >
                    <StarOutline />
                  </IconButton>
                </Tooltip>{" "}
                <Tooltip
                  title="Share"
                  placement="top"
                >
                  <IconButton
                    sx={{
                      border: "none",
                    }}
                  >
                    <ShareOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title="Delete"
                  placement="top"
                >
                  <IconButton
                    sx={{
                      border: "none",
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </>
        )}

        <Stack mt={0.5}>
          {isExpanded ? (
            <Box sx={{ p: 1 }}>
              <UnfoldLess
                sx={{
                  fontSize: 20,
                }}
              />
            </Box>
          ) : (
            <Button
              sx={{
                mr: -1.5,
                color: "onSurface",
              }}
            >
              Expand
              <UnfoldLess
                sx={{
                  fontSize: 20,
                  ml: 1,
                }}
              />
            </Button>
          )}
        </Stack>
      </Stack>
    </AccordionSummary>
  );
}

export default AccordionMessageHeader;
