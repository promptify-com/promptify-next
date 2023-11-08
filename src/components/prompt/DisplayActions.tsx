import React, { useEffect, useState } from "react";
import { Box, Button, Divider, IconButton, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  Delete,
  DeleteOutline,
  Edit,
  InfoOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { RenameForm } from "../common/forms/RenameForm";
import {
  useDeleteExecutionMutation,
  useExecutionFavoriteMutation,
  useUpdateExecutionMutation,
} from "@/core/api/executions";
import useTruncate from "@/hooks/useTruncate";
import { DeleteDialog } from "../dialog/DeleteDialog";

interface Props {
  selectedExecution: TemplatesExecutions | null;
  onOpenExport: () => void;
}

export const DisplayActions: React.FC<Props> = ({ selectedExecution, onOpenExport }) => {
  const { palette } = useTheme();
  const { truncate } = useTruncate();
  const [updateExecution, { isError, isLoading }] = useUpdateExecutionMutation();
  const [deleteExecution] = useDeleteExecutionMutation();
  const [favoriteExecution] = useExecutionFavoriteMutation();
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [executionTitle, setExecutionTitle] = useState(selectedExecution?.title);
  const [renameAllowed, setRenameAllowed] = useState(false);
  const [deleteAllowed, setDeleteAllowed] = useState(false);

  useEffect(() => {
    setExecutionTitle(selectedExecution?.title);
  }, [selectedExecution]);

  const renameSave = async () => {
    if (executionTitle?.length && selectedExecution?.id) {
      await updateExecution({
        id: selectedExecution?.id,
        data: { title: executionTitle },
      });
      if (!isError && !isLoading) {
        setRenameAllowed(false);
      }
    }
  };

  const saveExecution = async () => {
    if (!!!selectedExecution || selectedExecution?.is_favorite) return;

    try {
      await favoriteExecution(selectedExecution.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        position: { xs: "fixed", md: "sticky" },
        top: { xs: "auto", md: "0px" },
        bottom: { xs: "74px", md: "auto" },
        left: 0,
        right: 0,
        zIndex: 90,
        p: { md: "8px 8px 8px 16px" },
        borderBottom: { xs: `1px solid ${palette.surface[5]}`, md: "none" },
        boxShadow: {
          xs: "0px -8px 40px 0px rgba(93, 123, 186, 0.09), 0px -8px 10px 0px rgba(98, 98, 107, 0.03)",
          md: "0px -1px 0px 0px #ECECF4 inset",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Big screen header */}
        <Stack
          display={{ xs: "none", md: "flex" }}
          direction={"row"}
          alignItems={"baseline"}
          justifyContent={"space-between"}
          gap={1}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            width={"30%"}
          >
            {!renameAllowed ? (
              <Button
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
                  ":hover": {
                    bgcolor: "surface.2",
                  },
                  svg: {
                    fontSize: "18px !important",
                  },
                }}
                onClick={() => setRenameAllowed(true)}
              >
                <Typography
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {truncate(executionTitle || "", { length: 35 })}
                </Typography>
              </Button>
            ) : (
              <RenameForm
                label="Spark"
                initialValue={executionTitle}
                onChange={setExecutionTitle}
                onSave={renameSave}
                onCancel={() => {
                  setRenameAllowed(false);
                  setExecutionTitle(selectedExecution?.title);
                }}
                disabled={isLoading}
              />
            )}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
          >
            <Tooltip
              title="Delete"
              enterDelay={1000}
              enterNextDelay={1000}
            >
              <IconButton
                sx={actionBtnStyle}
                onClick={e => {
                  e.stopPropagation();
                  setDeleteAllowed(true);
                }}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
            <Divider
              orientation="vertical"
              sx={{ width: "1px", height: "25px", borderColor: "surface.5" }}
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
              sx={{ width: "1px", height: "25px", borderColor: "surface.5" }}
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
          </Stack>
        </Stack>

        {/* Small screen header */}
        <Box
          display={"flex"}
          alignItems={"center"}
        >
          <Stack
            flex={1}
            display={{ md: "none" }}
            direction={"row"}
            alignItems={"center"}
            gap={1}
            p={"8px 16px"}
          ></Stack>
          <Stack
            display={{ md: "none" }}
            direction={"row"}
            alignItems={"center"}
            gap={1}
            p={"8px 16px"}
          >
            <Tooltip title="Export">
              <IconButton
                onClick={onOpenExport}
                sx={{
                  border: "none",
                  "&:hover": {
                    bgcolor: "surface.2",
                  },
                }}
              >
                <ShareOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>

      {deleteAllowed && selectedExecution && (
        <DeleteDialog
          open={deleteAllowed}
          dialogTitle="Delete Spark"
          dialogContentText={`Are you sure you want to delete ${selectedExecution.title || "this"} Spark?`}
          onClose={() => {
            setDeleteAllowed(false);
          }}
          onSubmit={async () => {
            await deleteExecution(selectedExecution.id);
            setDeleteAllowed(false);
          }}
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
  },
  svg: {
    fontSize: "16px",
  },
};
