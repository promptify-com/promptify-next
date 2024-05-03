import Card from "@mui/material/Card";
import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import CloudOutlined from "@mui/icons-material/CloudOutlined";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import MoreVert from "@mui/icons-material/MoreVert";
import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import CloudDone from "@mui/icons-material/CloudDone";
import CloudOffOutlined from "@mui/icons-material/CloudOffOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import { SparkSaveDeletePopup } from "@/components/dialog/SparkSaveDeletePopup";
import { formatDate, timeLeft } from "@/common/helpers/timeManipulation";
import { isImageOutput } from "@/components/Prompt/Utils";
import { ExecutionContent } from "@/components/common/ExecutionContent";

const EXECUTION_LIFETIME_DAYS = 30;

interface Props {
  execution: ExecutionWithTemplate;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export default function CardDocument({ execution, onClick }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportPopup, setExportPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [isFavorite, setIsFavorite] = useState(execution.is_favorite);
  const firstPromptOutput = execution.prompt_executions?.[0]?.output ?? "";
  const [content, setContent] = useState(firstPromptOutput ?? "");

  useEffect(() => {
    if (firstPromptOutput) {
      import("@/common/helpers/htmlHelper").then(({ markdownToHTML, sanitizeHTML }) => {
        markdownToHTML(firstPromptOutput).then(res => setContent(sanitizeHTML(res)));
      });
    }
  }, [firstPromptOutput]);

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const saveExecution = async () => {
    const status = isFavorite;
    setIsFavorite(!isFavorite);
    try {
      if (status) {
        await deleteExecutionFavorite(execution.id);
      } else {
        await favoriteExecution(execution.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const actionsOpened = Boolean(menuAnchor);
  const deleteDeadline = new Date(
    new Date(execution.created_at).setDate(new Date(execution.created_at).getDate() + EXECUTION_LIFETIME_DAYS),
  );
  const daysLeft = timeLeft(deleteDeadline);
  const autoDeleteDate = daysLeft !== "0" ? `${daysLeft} left` : "Soon";

  return (
    <>
      <Card
        key={execution.id}
        component={"a"}
        onClick={onClick}
        elevation={0}
        sx={{
          display: "block",
          position: "relative",
          height: "315px",
          maxWidth: "430px",
          p: "8px",
          borderRadius: "16px",
          textDecoration: "none",
          cursor: "pointer",
          bgcolor: "surfaceContainerLowest",
          transition: "background-color 0.3s ease",
          ".actions-btn, .delete-time": {
            opacity: actionsOpened ? 1 : 0,
            transition: "opacity .2s ease",
          },
          ":hover": {
            bgcolor: "surfaceContainerLow",
            ".delete-time-container": {
              bgcolor: "surfaceContainerLowest",
            },
            ".actions-btn, .delete-time": {
              opacity: 1,
            },
          },
        }}
      >
        <Box
          sx={{
            p: "16px",
            borderRadius: "16px",
            bgcolor: "surfaceContainer",
          }}
        >
          <Stack
            alignItems={"flex-start"}
            gap={2}
            sx={{
              height: "150px",
              width: "calc(85% - 64px)",
              m: "auto",
              overflow: "hidden",
              bgcolor: "surfaceContainerLowest",
              p: "32px 32px 24px 32px",
              borderRadius: "4px",
            }}
          >
            <Typography
              fontSize={16}
              fontWeight={400}
              color={"onSurface"}
            >
              {execution.title}
            </Typography>
            {isImageOutput(firstPromptOutput) && (
              <>
                <Box
                  component={"img"}
                  alt={"Promptify"}
                  src={firstPromptOutput}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    (e.target as HTMLImageElement).src = require("@/assets/images/default-thumbnail.jpg");
                  }}
                  sx={{
                    borderRadius: "8px",
                    width: "60%",
                    objectFit: "cover",
                  }}
                />
              </>
            )}
            {!isImageOutput(firstPromptOutput) && <ExecutionContent content={content} />}
          </Stack>
        </Box>
        <Box p={"8px"}>
          <Typography
            fontSize={16}
            fontWeight={500}
            color={"onSurface"}
            sx={oneLineStyle}
          >
            {execution.title}
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={400}
            color={"secondary.light"}
            sx={oneLineStyle}
          >
            {execution.template?.title}
          </Typography>
          <Typography
            fontSize={12}
            fontWeight={400}
            color={"secondary.light"}
            sx={oneLineStyle}
          >
            {formatDate(execution.created_at)}
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 14,
            svg: {
              p: "2px",
              bgcolor: "surfaceContainerLowest",
              borderRadius: "99px",
            },
          }}
        >
          {isFavorite ? (
            <CloudDone color="primary" />
          ) : (
            <Stack
              className="delete-time-container"
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={"2px"}
              sx={{
                p: "2px",
                borderRadius: "99px",
                overflow: "hidden",
                fontSize: 12,
                fontWeight: 400,
                color: "secondary.light",
                transition: "background-color .2s ease",
              }}
            >
              <ScheduleOutlined sx={{ color: "secondary.light" }} />
              <Box
                component={"span"}
                className="delete-time"
                sx={{
                  pr: "6px",
                }}
              >
                {autoDeleteDate}
              </Box>
            </Stack>
          )}
        </Box>
        <IconButton
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setMenuAnchor(e.currentTarget);
          }}
          className="actions-btn"
          sx={{
            position: "absolute",
            top: 16,
            right: 12,
            zIndex: 999,
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
            },
          }}
        >
          <MoreVert sx={{ fontSize: "24px" }} />
        </IconButton>
      </Card>
      {actionsOpened && (
        <Menu
          anchorEl={menuAnchor}
          open={actionsOpened}
          onClose={() => setMenuAnchor(null)}
          onClick={e => e.preventDefault()}
          disableScrollLock
          sx={{
            ".MuiPaper-root": {
              width: "199px",
              borderRadius: "16px",
            },
            ".MuiList-root": {
              p: 0,
            },
          }}
        >
          <MenuItem
            onClick={e => setExportPopup(true)}
            sx={menuItemStyle}
          >
            <ShareOutlined /> Export
          </MenuItem>
          <MenuItem
            onClick={saveExecution}
            sx={menuItemStyle}
          >
            {isFavorite ? (
              <>
                <CloudOffOutlined /> Save as draft
              </>
            ) : (
              <>
                <CloudOutlined /> Save as document
              </>
            )}
          </MenuItem>
          <MenuItem
            onClick={e => setDeletePopup(true)}
            sx={menuItemStyle}
          >
            <DeleteForeverOutlined /> Delete
          </MenuItem>
          {exportPopup && (
            <SparkExportPopup
              onClose={() => setExportPopup(false)}
              activeExecution={execution}
            />
          )}
          {deletePopup && (
            <SparkSaveDeletePopup
              type={"delete"}
              activeExecution={execution}
              onClose={() => setDeletePopup(false)}
            />
          )}
        </Menu>
      )}
    </>
  );
}

const oneLineStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};
const menuItemStyle = {
  gap: 2,
  p: "8px 8px 8px 16px",
  fontSize: 14,
  fontWeight: 400,
  svg: {
    fontSize: 20,
  },
};
