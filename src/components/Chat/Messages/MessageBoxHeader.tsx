import Stack from "@mui/material/Stack";
import Image from "@/components/design-system/Image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAppSelector } from "@/hooks/useStore";
import RunButton from "../RunButton";
import TemplateActions from "@/components/Chat/TemplateActions";

interface Props {
  onExpand?: () => void;
  onGenerate?: () => void;
  variant: "FORM" | "EXECUTION";
  showRunButton?: boolean;
  onScrollToBottom?: () => void;
}

function MessageBoxHeader({ onExpand, onGenerate, variant, showRunButton, onScrollToBottom }: Props) {
  const { selectedChatOption, selectedTemplate, answers, inputs, params } = useAppSelector(state => state.chat);

  const showHeaderActions = Boolean(selectedChatOption === "FORM" && variant === "FORM");

  const totalQuestions = inputs.length + params.length;

  return (
    <Stack
      bgcolor={"surface.2"}
      p={{ xs: "8px 16px", md: "16px 24px" }}
      borderRadius={"24px"}
      direction={{ xs: "column", md: "row" }}
      alignItems={{ md: "center" }}
      justifyContent={"space-between"}
      gap={2}
      width={{
        xs: "-webkit-fill-available",
        md: variant === "FORM" && selectedChatOption === "FORM" ? "100%" : "-webkit-fill-available",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        <Box
          sx={{
            zIndex: 0,
            position: "relative",
            width: { xs: "100px", md: "60px" },
            height: { xs: "60px", md: "45px" },
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
      </Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        {showHeaderActions && (
          <>
            <Button
              variant="text"
              sx={{
                bgcolor: "surface.4",

                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={onExpand}
            >
              Instructions: {answers.length} of {totalQuestions}
            </Button>
            <RunButton
              onClick={() => {
                if (typeof onGenerate === "function") {
                  onGenerate();
                }
              }}
              disabled={!showRunButton}
            />
          </>
        )}
        {selectedTemplate && (
          <TemplateActions
            template={selectedTemplate}
            onScrollToBottom={onScrollToBottom}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default MessageBoxHeader;
