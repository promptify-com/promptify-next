import React, { useState } from "react";
import { Box, IconButton, Stack, Tab, Tabs, Typography, alpha } from "@mui/material";
import { RenameForm } from "../common/forms/RenameForm";
import { INodesData, IPromptParams } from "@/common/types/builder";
import { Node } from "rete/_types/presets/classic";
import { useGetEnginesQuery } from "@/core/api/engines";
import { Close, DeleteOutline, ModeEdit, Settings, Tune } from "@mui/icons-material";
import { theme } from "@/theme";
import Terminal from "@/assets/icons/Terminal";
import { NodeContentForm } from "./NodeContentForm";
import { Stylizer } from "./Stylizer";

const CustomTabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      hidden={value !== index}
      {...other}
    >
      {value === index && <React.Fragment>{children}</React.Fragment>}
    </Box>
  );
};
const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

interface Props {
  close: () => void;
  editorNode: Node;
  removeNode: () => void;
  updateTitle: (value: string) => void | undefined;
  selectedNodeData: INodesData | null;
  setSelectedNodeData: (value: INodesData) => void;
  nodeCount: number;
  nodesData: INodesData[];
  setNodesData: (value: INodesData[]) => void;
}

export const PromptForm: React.FC<Props> = ({
  close,
  removeNode,
  updateTitle,
  selectedNodeData,
  setSelectedNodeData,
  nodesData,
}) => {
  const [renameAllow, setRenameAllow] = useState(false);

  const { data: engines } = useGetEnginesQuery();
  const engine = engines?.find(_engine => _engine.id === selectedNodeData?.engine_id);

  const [tabsValue, setTabsValue] = useState(0);
  const changeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  const changeTitle = (title: string) => {
    if (!selectedNodeData || !title) return;

    setSelectedNodeData({
      ...selectedNodeData,
      title,
    });
    updateTitle(title);
  };

  const changeContent = (content: string) => {
    if (!selectedNodeData || !content) return;

    setSelectedNodeData({
      ...selectedNodeData,
      content,
    });
  };

  const changePromptParams = (params: IPromptParams[]) => {
    if (!selectedNodeData) return;

    setSelectedNodeData({
      ...selectedNodeData,
      parameters: params,
    });
  };

  return (
    <Stack
      sx={{
        height: "100svh",
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
      <Stack sx={{ height: "calc(100% - 67px)" }}>
        <Tabs
          value={tabsValue}
          onChange={changeTab}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{ p: "8px 0 0", borderBottom: "1px solid #ECECF4" }}
        >
          <Tab
            label="Input"
            {...a11yProps(0)}
            icon={<Terminal />}
            iconPosition="start"
            sx={{ ...tabStyle, color: `${alpha(theme.palette.onSurface, 0.4)}` }}
          />
          <Tab
            label="Stylizer"
            {...a11yProps(1)}
            icon={<Tune />}
            iconPosition="start"
            sx={{ ...tabStyle, color: `${alpha(theme.palette.onSurface, 0.4)}` }}
          />
          <Tab
            label="Options"
            {...a11yProps(2)}
            icon={<Settings />}
            iconPosition="start"
            sx={{ ...tabStyle, color: `${alpha(theme.palette.onSurface, 0.4)}` }}
          />
        </Tabs>
        <CustomTabPanel
          value={tabsValue}
          index={0}
          sx={{ height: "calc(100% - 57px)" }}
        >
          <NodeContentForm
            content={selectedNodeData?.content}
            nodes={nodesData}
            onChange={changeContent}
          />
        </CustomTabPanel>
        <CustomTabPanel
          value={tabsValue}
          index={1}
        >
          <Stylizer
            changePromptParams={changePromptParams}
            selectedNodeData={selectedNodeData}
          />
        </CustomTabPanel>
        <CustomTabPanel
          value={tabsValue}
          index={2}
        >
          Item Three
        </CustomTabPanel>
      </Stack>
    </Stack>
  );
};

const tabStyle = {
  fontSize: 13,
  fontWeight: 500,
  textTransform: "none",
  p: "9px 16px",
  minHeight: "auto",
  svg: {
    width: "20px",
    height: "20px",
    mr: "8px",
    opacity: 0.5,
  },
  "&.Mui-selected svg": {
    opacity: 1,
  },
};
