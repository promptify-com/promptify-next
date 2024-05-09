import Stack from "@mui/material/Stack";
import Image from "@/components/design-system/Image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useAppSelector } from "@/hooks/useStore";
import RunButton from "@/components/Chat/RunButton";
import TemplateActions from "@/components/Chat/TemplateActions";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { useMemo, useState } from "react";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import useBrowser from "@/hooks/useBrowser";
import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";

interface Props {
  onExpand?: () => void;
  onGenerate?: () => void;
  variant: "FORM" | "EXECUTION";
  showRunButton?: boolean;
  onScrollToBottom?: () => void;
  template: Templates;
  execution?: TemplatesExecutions;
}

function MessageBoxHeader({
  onExpand,
  onGenerate,
  variant,
  showRunButton,
  onScrollToBottom,
  template,
  execution,
}: Props) {
  const { selectedTemplate, selectedChatOption, answers, inputs, params } = useAppSelector(state => state.chat);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [openExportPopup, setOpenExportPopup] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);

  const isInputStyleForm = currentUser?.preferences?.input_style === "form" || selectedChatOption === "form";
  const showHeaderActions = Boolean(isInputStyleForm && variant === "FORM");
  const totalQuestions = inputs.length + params.length;
  const templateShown = template || selectedTemplate;

  const activeExecution = useMemo(() => {
    if (execution) {
      return {
        ...execution,
        template: {
          ...execution.template,
          title: template.title,
          slug: template.slug,
          thumbnail: template.thumbnail,
        },
      };
    }
    return null;
  }, [execution]);

  return (
    <Stack
      bgcolor={"surface.2"}
      p={{ xs: "8px 16px", md: "16px 24px" }}
      borderRadius={"24px"}
      direction={{ xs: !showHeaderActions ? "row" : "column", md: "row" }}
      alignItems={{ md: "center" }}
      justifyContent={"space-between"}
      gap={2}
      width={{
        xs: "-webkit-fill-available",
        md: variant === "FORM" && isInputStyleForm ? "100%" : "-webkit-fill-available",
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
            src={templateShown?.thumbnail!}
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
          {templateShown?.title}
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
        {variant === "EXECUTION" && !isGenerating && (
          <Button
            variant="text"
            startIcon={<ShareOutlined />}
            sx={{
              color: "onSurface",
              fontSize: { xs: 12, md: 16 },
              minWidth: { xs: "40px", md: "auto" },
              p: { xs: 1, md: "4px 20px" },
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
            onClick={() => setOpenExportPopup(true)}
          >
            Export
          </Button>
        )}

        {templateShown && (
          <TemplateActions
            template={templateShown}
            onScrollToBottom={onScrollToBottom}
            onlyNew
          />
        )}

        {openExportPopup && execution?.id && (
          <SparkExportPopup
            onClose={() => setOpenExportPopup(false)}
            activeExecution={activeExecution}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default MessageBoxHeader;
