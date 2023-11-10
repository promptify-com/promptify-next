import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Bookmark, BookmarkBorder, Close, DeleteOutline, Edit, ShareOutlined } from "@mui/icons-material";
import { ExecutionTemplatePopupType, TemplatesExecutions } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { useExecutionFavoriteMutation } from "@/core/api/executions";
import useTruncate from "@/hooks/useTruncate";
import { SparkSaveDeletePopup } from "@/components/dialog/SparkSaveDeletePopup";
import { LogoApp } from "@/assets/icons/LogoApp";
import { theme } from "@/theme";

interface Props {
  selectedExecution: TemplatesExecutions | null;
  onOpenExport: () => void;
  close: () => void;
}

export const DisplayActions: React.FC<Props> = ({ selectedExecution, onOpenExport, close }) => {
  const { palette } = useTheme();
  const { truncate } = useTruncate();
  const [favoriteExecution] = useExecutionFavoriteMutation();
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const [executionTitle, setExecutionTitle] = useState(selectedExecution?.title);
  const [popup, setPopup] = useState<ExecutionTemplatePopupType>(null);

  useEffect(() => {
    setExecutionTitle(selectedExecution?.title);
  }, [selectedExecution]);

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
        bgcolor: "surface.3",
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
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
        >
          {!isGenerating ? (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
              width={"40%"}
            >
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
                onClick={() => setPopup("update")}
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
            </Stack>
          ) : (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
            >
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "surface.1",
                  p: "4px",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    display: "flex",
                  }}
                >
                  <LogoApp
                    color={theme.palette.primary.main}
                    width={14}
                  />
                </Box>
                <CircularProgress
                  size={32}
                  sx={{
                    color: "primary.main",
                    ".MuiCircularProgress-circle": {
                      strokeWidth: 2.5,
                    },
                  }}
                />
              </Box>
              <Typography
                fontSize={15}
                fontWeight={500}
                color={"text.secondary"}
                sx={{ opacity: 0.5 }}
              >
                Generating in progress...
              </Typography>
            </Stack>
          )}
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
                  setPopup("delete");
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
            <IconButton
              sx={{
                ...actionBtnStyle,
                opacity: 0.45,
              }}
              onClick={close}
            >
              <Close />
            </IconButton>
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

      {(popup === "delete" || popup === "update") && (
        <SparkSaveDeletePopup
          type={popup}
          activeExecution={selectedExecution}
          onClose={() => setPopup(null)}
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
