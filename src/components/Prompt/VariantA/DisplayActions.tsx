import React, { useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  Close,
  DeleteOutline,
  Edit,
  ShareOutlined,
  VisibilityOff,
  VisibilityOutlined,
} from "@mui/icons-material";

import { ExecutionTemplatePopupType } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import useTruncate from "@/hooks/useTruncate";
import { SparkSaveDeletePopup } from "@/components/dialog/SparkSaveDeletePopup";
import { useDispatch } from "react-redux";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { ProgressLogo } from "@/components/common/ProgressLogo";
import AvatarWithInitials from "@/components/Prompt/Common/AvatarWithInitials";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  onOpenExport: () => void;
  showPreviews: boolean;
  toggleShowPreviews: () => void;
}

export const DisplayActions: React.FC<Props> = ({ onOpenExport, showPreviews, toggleShowPreviews }) => {
  const { truncate } = useTruncate();
  const dispatch = useDispatch();
  const { isMobile } = useBrowser();
  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const selectedExecution = useAppSelector(state => state.executions?.selectedExecution ?? null);
  const repeatedExecution = useAppSelector(state => state.executions?.repeatedExecution ?? null);

  const [executionTitle, setExecutionTitle] = useState(selectedExecution?.title);
  const [executionPopup, setExecutionPopup] = useState<ExecutionTemplatePopupType>(null);

  useEffect(() => {
    setExecutionTitle(selectedExecution?.title);
  }, [selectedExecution]);

  useEffect(() => {
    if (isMobile && repeatedExecution) {
      closeExecutionDisplay();
    }
  }, [repeatedExecution]);

  const saveExecution = async () => {
    if (!!!selectedExecution) return;

    try {
      if (selectedExecution.is_favorite) {
        await deleteExecutionFavorite(selectedExecution.id);
      } else {
        await favoriteExecution(selectedExecution.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeExecutionDisplay = () => {
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
  };

  return (
    <Box
      sx={{
        bgcolor: "surface.3",
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        p: "8px 8px 8px 16px",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Stack
          direction={{ md: "row" }}
          alignItems={{ xs: "flex-end", md: "center" }}
          justifyContent={"space-between"}
          gap={1}
        >
          {!isGenerating ? (
            <>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                width={{ xs: "100%", md: "auto" }}
              >
                <Button
                  onClick={() => setExecutionPopup("update")}
                  endIcon={<Edit />}
                  sx={{
                    width: "100%",
                    fontSize: 15,
                    fontWeight: 500,
                    p: "4px 10px",
                    color: "onSurface",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    justifyContent: "space-between",
                    bgcolor: { xs: "surface.2", md: "transparent" },
                    ":hover": {
                      bgcolor: "surface.2",
                    },
                    svg: {
                      fontSize: "18px !important",
                    },
                  }}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={1}
                    maxWidth={"90%"}
                  >
                    <AvatarWithInitials
                      title={executionTitle || ""}
                      variant="a"
                    />

                    <Typography
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {truncate(executionTitle || "", { length: 35 })}
                    </Typography>
                  </Stack>
                </Button>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
              >
                <Tooltip
                  title="Preview"
                  enterDelay={1000}
                  enterNextDelay={1000}
                >
                  <IconButton
                    sx={actionBtnStyle}
                    onClick={toggleShowPreviews}
                  >
                    {showPreviews ? <VisibilityOff /> : <VisibilityOutlined />}
                  </IconButton>
                </Tooltip>
                <Divider
                  orientation="vertical"
                  sx={actionsDividerStyle}
                />
                <Tooltip
                  title="Delete"
                  enterDelay={1000}
                  enterNextDelay={1000}
                >
                  <IconButton
                    sx={actionBtnStyle}
                    onClick={e => {
                      e.stopPropagation();
                      setExecutionPopup("delete");
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
                <Divider
                  orientation="vertical"
                  sx={actionsDividerStyle}
                />
                <Tooltip
                  title="Save"
                  enterDelay={1000}
                  enterNextDelay={1000}
                >
                  <IconButton
                    sx={actionBtnStyle}
                    onClick={saveExecution}
                  >
                    {selectedExecution?.is_favorite ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Tooltip>
                <Divider
                  orientation="vertical"
                  sx={actionsDividerStyle}
                />
                {selectedExecution?.id && (
                  <Tooltip
                    title="Share"
                    enterDelay={1000}
                    enterNextDelay={1000}
                  >
                    <IconButton
                      onClick={onOpenExport}
                      sx={actionBtnStyle}
                    >
                      <ShareOutlined />
                    </IconButton>
                  </Tooltip>
                )}
                <Divider
                  orientation="vertical"
                  sx={actionsDividerStyle}
                />
                <IconButton
                  sx={{
                    ...actionBtnStyle,
                    opacity: 0.45,
                  }}
                  onClick={closeExecutionDisplay}
                >
                  <Close />
                </IconButton>
              </Stack>
            </>
          ) : (
            <Stack
              width={"100%"}
              direction={"row"}
              alignItems={"center"}
              gap={2}
            >
              <ProgressLogo size="small" />
              <Typography
                fontSize={15}
                fontWeight={500}
                color={"text.secondary"}
                sx={{ opacity: 0.5 }}
              >
                Generation in progress...
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>

      {(executionPopup === "delete" || executionPopup === "update") && (
        <SparkSaveDeletePopup
          type={executionPopup}
          activeExecution={selectedExecution}
          onClose={() => setExecutionPopup(null)}
          onUpdate={execution => setExecutionTitle(execution.title)}
        />
      )}
    </Box>
  );
};

const actionBtnStyle = {
  border: "none",
  p: "8px",
  "&:hover": {
    bgcolor: "surface.2",
    opacity: 1,
  },
  svg: {
    fontSize: "16px",
  },
};
const actionsDividerStyle = {
  width: "1px",
  height: "25px",
  borderColor: "surface.5",
};
