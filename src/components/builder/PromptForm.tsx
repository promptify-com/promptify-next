import React, { useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { RenameForm } from "../common/forms/RenameForm";
import { INodesData } from "@/common/types/builder";
import { Node } from "rete/_types/presets/classic";
import { useGetEnginesQuery } from "@/core/api/engines";
import { Close, DeleteOutline, ModeEdit } from "@mui/icons-material";

interface Props {
  close: () => void;
  editorNode: Node;
  removeNode: () => void;
  updateTitle: (value: string) => void | undefined;
  selectedNodeData: INodesData | null;
  setSelectedNodeData: (value: INodesData) => void;
  nodeCount: number;
  nodesData: INodesData[] | null;
  setNodesData: (value: INodesData[]) => void;
}

export const PromptForm: React.FC<Props> = ({
  close,
  removeNode,
  updateTitle,
  selectedNodeData,
  setSelectedNodeData,
  nodesData,
  setNodesData,
}) => {
  const [renameAllow, setRenameAllow] = useState(false);

  const { data: engines } = useGetEnginesQuery();
  const engine = engines?.find(_engine => _engine.id === selectedNodeData?.engine_id);

  const changeTitle = (title: string) => {
    if (!selectedNodeData || !title) return;

    setSelectedNodeData({
      ...selectedNodeData,
      title,
    });
    updateTitle(title);
  };

  return (
    <Box
      sx={{
        bgcolor: "surface.1",
      }}
    >
      <Box sx={{ p: "24px 16px 8px 16px" }}>
        {!renameAllow ? (
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Stack
              flex={1}
              direction={"row"}
              alignItems={"center"}
              gap={1}
            >
              <img
                src={engine?.icon}
                alt={engine?.name}
                loading="lazy"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                }}
              />
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={0.5}
              >
                <Typography
                  sx={{ color: "onSurface", fontSize: 20, fontWeight: 400 }}
                  dangerouslySetInnerHTML={{ __html: selectedNodeData?.title || "" }}
                />
                <ModeEdit
                  sx={{ cursor: "pointer", fontSize: "16px" }}
                  onClick={() => setRenameAllow(true)}
                />
              </Stack>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
            >
              <IconButton
                onClick={removeNode}
                sx={{
                  border: "none",
                  "&:hover": {
                    backgroundColor: "surface.2",
                  },
                }}
              >
                <DeleteOutline />
              </IconButton>
              <IconButton
                onClick={close}
                sx={{
                  border: "none",
                  "&:hover": {
                    backgroundColor: "surface.2",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Stack>
          </Stack>
        ) : (
          <RenameForm
            label="Prompt"
            initialValue={selectedNodeData?.title}
            onSave={val => {
              changeTitle(val);
              setRenameAllow(false);
            }}
            onCancel={() => {
              setRenameAllow(false);
            }}
          />
        )}
      </Box>
    </Box>
  );
};
