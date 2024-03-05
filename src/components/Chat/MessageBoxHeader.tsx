import Stack from "@mui/material/Stack";
import Image from "../design-system/Image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useAppSelector } from "@/hooks/useStore";
import ArrowCircleUp from "@/assets/icons/ArrowCircleUp";

interface Props {
  onExpand?: () => void;
  onGenerate?: () => void;
  variant: "FORM" | "EXECUTION";
}

function MessageBoxHeader({ onExpand, onGenerate, variant }: Props) {
  const { selectedChatOption, selectedTemplate, answers, inputs } = useAppSelector(state => state.chat);

  const allRequiredInputsAnswered = (): boolean => {
    const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);
    if (!requiredQuestionNames.length) {
      return true;
    }
    const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));
    return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
  };

  const allowGenerate = allRequiredInputsAnswered();

  const showHeaderActions = Boolean(selectedChatOption === "FORM" && variant === "FORM");

  return (
    <Stack
      bgcolor={"surface.2"}
      p={"16px 24px"}
      borderRadius={"24px"}
      direction={"row"}
      alignItems={"center"}
      gap={2}
      width={variant === "EXECUTION" ? "content-fit" : "100%"}
    >
      <Box
        sx={{
          zIndex: 0,
          position: "relative",
          width: "60px",
          height: "45px",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Image
          src={selectedTemplate?.thumbnail!}
          alt={"Image 1"}
          priority={true}
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <Typography
        fontSize={18}
        fontWeight={500}
        lineHeight={"25.2px"}
        sx={{
          flex: 1,
        }}
      >
        {selectedTemplate?.title}
      </Typography>
      {showHeaderActions && (
        <Stack
          direction={"row"}
          gap={2}
          alignItems={"center"}
          onClick={onExpand}
        >
          <Button
            variant="text"
            sx={{
              bgcolor: "surface.4",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            Instructions: {answers.length} of {inputs.length}
          </Button>
          <Button
            variant="text"
            sx={{
              bgcolor: "primary.main",
              color: "onPrimary",
              border: "none",
              "&:hover": {
                bgcolor: "primary.main",
                opacity: 0.9,
              },
              ":disabled": {
                bgcolor: "surface.5",
                cursor: "not-allowed",
              },
            }}
            disabled={!allowGenerate}
            endIcon={<ArrowCircleUp color={!allowGenerate ? "gray" : "white"} />}
            onClick={() => {
              if (typeof onGenerate === "function") {
                onGenerate();
              }
            }}
          >
            Start
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

export default MessageBoxHeader;
