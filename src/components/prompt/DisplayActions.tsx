import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import { Edit, InfoOutlined } from "@mui/icons-material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import ShareIcon from "@/assets/icons/ShareIcon";
import { useAppSelector } from "@/hooks/useStore";
import { RenameForm } from "../common/forms/RenameForm";
import { useUpdateExecutionMutation } from "@/core/api/executions";
import useTruncate from "@/hooks/useTruncate";

interface Props {
  selectedExecution: TemplatesExecutions | null;
  onOpenExport: () => void;
}

export const DisplayActions: React.FC<Props> = ({ selectedExecution, onOpenExport }) => {
  const { palette } = useTheme();
  const { truncate } = useTruncate();
  const [updateExecution, { isError, isLoading }] = useUpdateExecutionMutation();
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [executionTitle, setExecutionTitle] = useState(selectedExecution?.title);
  const [renameAllow, setRenameAllow] = useState(false);

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
        setRenameAllow(false);
      }
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
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            minWidth={"30%"}
          >
            {!renameAllow ? (
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
                }}
                onClick={() => setRenameAllow(true)}
              >
                {truncate(executionTitle || "", { length: 35 })}
              </Button>
            ) : (
              <RenameForm
                label="Spark"
                initialValue={executionTitle}
                onChange={setExecutionTitle}
                onSave={renameSave}
                onCancel={() => {
                  setRenameAllow(false);
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
            {selectedExecution?.id && (
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
                  <ShareIcon />
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
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

const iconButtonStyle = {
  border: "none",
  p: "8px",
  color: "onBackground",
  opacity: 0.8,
  ":hover": { opacity: 1, color: "onBackground" },
};
