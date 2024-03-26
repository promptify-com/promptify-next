import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";
import ElectricBolt from "@mui/icons-material/ElectricBolt";
import Image from "@/components/design-system/Image";
import type { Templates } from "@/core/api/dto/templates";
import TemplateActions from "@/components/Chat/TemplateActions";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/useStore";
import { setSelectedTemplate, setAnswers } from "@/core/store/chatSlice";
import { IconButton, Tooltip } from "@mui/material";
import { DeleteForeverOutlined, ModeEditOutline } from "@mui/icons-material";
import { useDeleteTemplateMutation } from "@/core/api/templates";
import { useState } from "react";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { setToast } from "@/core/store/toastSlice";
import CustomTooltip from "@/components/Prompt/Common/CustomTooltip";

interface Props {
  variant: "chat" | "editor_builder";
  template: Templates;
  onScrollToBottom?: () => void;
}

function TemplateSuggestionItem({ template, onScrollToBottom, variant }: Props) {
  const dispatch = useAppDispatch();
  const [deleteTemplate] = useDeleteTemplateMutation();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const { thumbnail, title, slug, description, executions_count, likes } = template;

  const handleRunPrompt = () => {
    dispatch(setSelectedTemplate(template));
    dispatch(setAnswers([]));
    setTimeout(() => {
      onScrollToBottom?.();
    }, 100);
  };

  const handleDeleteTemplate = async () => {
    try {
      await deleteTemplate(template.id);
      dispatch(setToast({ message: "Template was successfully deleted", severity: "success" }));
    } catch (error) {
      console.error(error, `Something went wrong deleting template - ${template.title}`);
    }
  };

  const isEditorBuilder = variant === "editor_builder";

  return (
    <Stack
      bgcolor={isEditorBuilder ? "transparent" : "surface.1"}
      border={isEditorBuilder ? "1px solid" : "none"}
      borderColor={"surfaceDim"}
      p={"16px 0px"}
      px={{ xs: "8px", md: "16px" }}
      borderRadius={"24px"}
      direction={{ xs: "column", md: "row" }}
      gap={"24px"}
      alignItems={"center"}
      justifyContent={"space-between"}
      width={"100%"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"24px"}
      >
        <Box
          component={Link}
          href={`/prompt/${slug}`}
          target="_blank"
          sx={{
            zIndex: 0,
            position: "relative",
            width: { xs: "260px", md: "152px" },
            minWidth: "152px",
            height: "113px",
            borderRadius: "24px",
            overflow: "hidden",
            textDecoration: "none",
          }}
        >
          <Image
            src={thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={title}
            priority={true}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
        <Stack
          direction={"column"}
          justifyItems={"flex-start"}
          gap={2}
        >
          <Stack alignItems={"flex-start"}>
            <Link
              href={`/prompt/${slug}`}
              target="_blank"
              style={{
                textDecoration: "none",
              }}
            >
              <Typography
                fontSize={{ xs: 15, md: 18 }}
                fontWeight={500}
                lineHeight={"25.2px"}
              >
                {title}
              </Typography>
            </Link>
            <Typography
              fontSize={{ xs: 14, md: 16 }}
              fontWeight={400}
              lineHeight={"22.2px"}
              sx={{
                opacity: 0.75,
              }}
            >
              {description}
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            gap={"8px"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
            >
              <Favorite
                sx={{
                  fontSize: "14px",
                  mr: "2px",
                }}
              />
              <Typography
                fontSize={13}
                fontWeight={400}
                lineHeight={"18.2px"}
              >
                {likes}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
            >
              <ElectricBolt
                sx={{
                  fontSize: "14px",
                  mr: "2px",
                }}
              />

              <Typography
                fontSize={13}
                fontWeight={400}
                lineHeight={"18.2px"}
              >
                {executions_count}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>

      {!isEditorBuilder ? (
        <Stack
          direction={"row"}
          alignItems={"center"}
          px={{ md: "30px" }}
          width={{ xs: "100%", md: "fit-content" }}
        >
          <Button
            variant="text"
            startIcon={<PlayArrow />}
            sx={{
              color: "onSurface",
              width: { xs: "100%", md: "fit-content" },
              bgcolor: { xs: "surfaceContainerLow", md: "transparent" },
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
            onClick={handleRunPrompt}
          >
            Run prompt
          </Button>
          <TemplateActions
            template={template}
            onScrollToBottom={onScrollToBottom}
          />
        </Stack>
      ) : (
        <Stack
          direction={"row"}
          alignItems={"center"}
          px={{ md: "20px" }}
          width={{ xs: "100%", md: "fit-content" }}
          gap={1}
        >
          <Tooltip
            title="Edit"
            placement="top"
            arrow
          >
            <Link href={`/prompt-builder/${template.slug}?editor=1`}>
              <IconButton
                sx={{
                  border: "none",
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ModeEditOutline />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip
            title="Delete"
            placement="top"
            arrow
          >
            <IconButton
              onClick={() => setConfirmDelete(true)}
              sx={{
                border: "none",
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <DeleteForeverOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      {confirmDelete && (
        <DeleteDialog
          open={true}
          dialogContentText={`Are you sure you want to remove this template - ${template.title}?`}
          onClose={() => setConfirmDelete(false)}
          onSubmit={handleDeleteTemplate}
        />
      )}
    </Stack>
  );
}

export default TemplateSuggestionItem;
