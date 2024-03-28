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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Edit from "@mui/icons-material/Edit";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import { getBaseUrl } from "@/common/helpers";
import { useDeleteTemplateMutation } from "@/core/api/templates";
import { useState } from "react";
import AddCommentOutlined from "@mui/icons-material/AddCommentOutlined";
import { useRouter } from "next/router";

interface Props {
  template: Templates;
  onScrollToBottom?: () => void;
  manageActions?: boolean;
}

function TemplateCard({ template, onScrollToBottom, manageActions }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { thumbnail, title, slug, description, favorites_count, executions_count, status } = template;
  const [confirmDialog, setConfirmDialog] = useState(false);

  const [deleteTemplate] = useDeleteTemplateMutation();

  const confirmDelete = async () => {
    await deleteTemplate(template.id);
    setConfirmDialog(false);
  };

  const handleRunPrompt = () => {
    dispatch(setSelectedTemplate(template));
    dispatch(setAnswers([]));
    setTimeout(() => {
      onScrollToBottom?.();
    }, 100);
  };

  return (
    <Stack
      bgcolor={"surfaceContainerLowest"}
      p={"16px 0px"}
      px={{ xs: "8px", md: "16px" }}
      borderRadius={"24px"}
      direction={{ xs: "column", md: "row" }}
      gap={"24px"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Stack
        direction={"row"}
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
          justifyContent={"space-between"}
          gap={2}
          py={"8px"}
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
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
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
              >
                {favorites_count}
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
              >
                {executions_count}
              </Typography>
            </Box>
            {manageActions && status === "PUBLISHED" && (
              <Typography
                fontSize={13}
                fontWeight={500}
                color={"primary.main"}
              >
                Published
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        px={{ md: "16px" }}
        width={{ xs: "100%", md: "fit-content" }}
      >
        {manageActions ? (
          <>
            <Button
              onClick={() => console.log("new chat")}
              startIcon={<AddCommentOutlined />}
              sx={{
                border: "1px solid",
                borderColor: "surfaceContainerHigh",
                p: "8px 16px",
                fontSize: 14,
                fontWeight: 500,
                color: "onSurface",
                svg: {
                  transform: "rotateY(180deg)",
                },
              }}
            >
              New chat
            </Button>
            <IconButton
              sx={btnStyle}
              onClick={() => window.open(`${getBaseUrl}/prompt-builder/${template.slug}`, "_blank")}
            >
              <Edit />
            </IconButton>
            <IconButton
              sx={btnStyle}
              onClick={() => setConfirmDialog(true)}
            >
              <DeleteForeverOutlined />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              variant="text"
              startIcon={<PlayArrow />}
              sx={btnStyle}
              onClick={handleRunPrompt}
            >
              Run prompt
            </Button>
            <TemplateActions
              template={template}
              onScrollToBottom={onScrollToBottom}
            />
          </>
        )}
      </Stack>

      {confirmDialog && (
        <Dialog
          open={confirmDialog}
          keepMounted
          disableScrollLock
          onClose={() => setConfirmDialog(false)}
        >
          <DialogTitle>{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete <b>{template.title}</b>?
              <br />
              Once deleted, it cannot be recovered. Please proceed with caution.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button onClick={confirmDelete}>Confirm</Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}

export default TemplateCard;

const btnStyle = {
  width: { xs: "100%", md: "fit-content" },
  border: "none",
  color: "onSurface",
  bgcolor: { xs: "surfaceContainerLow", md: "transparent" },
  "&:hover": {
    bgcolor: "action.hover",
  },
};
