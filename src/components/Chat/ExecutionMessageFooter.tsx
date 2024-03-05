import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useAppSelector } from "@/hooks/useStore";

interface Props {
  onAbort: () => void;
}

function ExecutionMessageFooter({ onAbort }: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  return (
    <>
      {isGenerating ? (
        <Stack
          p={"16px 24px"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <CircularProgress
              color="primary"
              size={"24px"}
            />
            <Typography
              fontSize={15}
              lineHeight={"18px"}
              fontWeight={400}
              letterSpacing={"0.2px"}
              sx={{
                opacity: 0.9,
              }}
            >
              Generation in progress...
            </Typography>
          </Stack>
          <Button
            variant="text"
            sx={{
              color: "onSurface",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
            onClick={onAbort}
          >
            Cancel
          </Button>
        </Stack>
      ) : (
        <Stack p={"16px 24px"}>
          <Typography
            fontSize={15}
            lineHeight={"18px"}
            fontWeight={400}
            letterSpacing={"0.2px"}
            sx={{
              opacity: 0.9,
            }}
          >
            Generation done in 39 second
          </Typography>
        </Stack>
      )}
    </>
  );
}

export default ExecutionMessageFooter;
