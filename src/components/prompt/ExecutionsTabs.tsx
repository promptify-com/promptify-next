import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  MenuList,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { CloudQueue, Create, Delete, Done, PriorityHighOutlined } from "@mui/icons-material";
import moment from "moment";
import SavedSpark from "@/assets/icons/SavedSpark";
import DraftSpark from "@/assets/icons/DraftSpark";
import {
  useDeleteExecutionMutation,
  usePostExecutionFavoriteMutation,
  usePutExecutionTitleMutation,
} from "@/core/api/executions";
import { DeleteDialog } from "../dialog/DeleteDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{
        height: { xs: "35svh", md: "50svh" },
        overflow: "auto",
        overscrollBehavior: "contain",
      }}
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
  executions: TemplatesExecutions[];
  selectedExecution: TemplatesExecutions | null;
  chooseExecution: (execution: TemplatesExecutions) => void;
}

export const ExecutionsTabs: React.FC<Props> = ({ executions, chooseExecution, selectedExecution }) => {
  const { palette } = useTheme();

  const [updateExecutionTitle, { isError, isLoading }] = usePutExecutionTitleMutation();
  const [postExecutionFavorite] = usePostExecutionFavoriteMutation();
  const [deleteExecution] = useDeleteExecutionMutation();

  const [tabsValue, setTabsValue] = useState(0);
  const changeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  const [executionTitle, setExecutionTitle] = useState(selectedExecution?.title);
  const [renameAllow, setRenameAllow] = useState(false);
  const [deleteAllow, setDeleteAllow] = useState(false);

  useEffect(() => {
    setExecutionTitle(selectedExecution?.title);
  }, [selectedExecution]);

  const renameSave = async () => {
    if (executionTitle?.length && selectedExecution?.id) {
      await updateExecutionTitle({
        id: selectedExecution?.id,
        data: { title: executionTitle },
      });
      if (!isError && !isLoading) {
        setRenameAllow(false);
      }
    }
  };

  const saveExecution = async () => {
    if (!!!selectedExecution || selectedExecution?.is_favorite) return;

    try {
      await postExecutionFavorite({ id: selectedExecution.id });
    } catch (error) {
      console.error(error);
    }
  };

  const pinnedExecutions = executions.filter(execution => execution.is_favorite);

  const ExecutionCard = ({ execution }: { execution: TemplatesExecutions }) => {
    return (
      <MenuItem
        key={execution.id}
        sx={{
          borderTop: "1px solid #E3E3E3",
          p: "16px",
          opacity: 0.8,
          "&:hover": { opacity: 1 },
        }}
        onClick={() => chooseExecution(execution)}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={2}
        >
          {execution.is_favorite ? (
            <SavedSpark
              size="32"
              color={palette.onSurface}
              opacity={1}
            />
          ) : (
            <DraftSpark
              size="32"
              color={palette.onSurface}
              opacity={1}
            />
          )}
          <Stack>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 14,
                color: "onSurface",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {execution.title}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: 12,
                color: "onSurface",
                opacity: 0.5,
              }}
            >
              {moment(execution.created_at).fromNow()}
            </Typography>
          </Stack>
        </Stack>
      </MenuItem>
    );
  };

  const ExecutionsList = (executionList: TemplatesExecutions[]) => (
    <MenuList
      sx={{
        flex: 1,
        p: 0,
        overflow: "auto",
        overscrollBehavior: "contain",
      }}
    >
      {executionList.length ? (
        executionList.map(exec => (
          <ExecutionCard
            key={exec.id}
            execution={exec}
          />
        ))
      ) : (
        <Stack sx={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
          <Typography sx={{ color: "onSurface", opacity: 0.5 }}>No sparks found</Typography>
        </Stack>
      )}
    </MenuList>
  );

  return (
    <Box sx={{ width: { xs: "90svw", md: "401px" } }}>
      <Box sx={{ p: "16px", borderBottom: `1px solid ${palette.surface[5]}` }}>
        <Box display={renameAllow ? "none" : "block"}>
          <Stack
            flexDirection={"row"}
            alignItems={"flex-start"}
            gap={1}
            sx={{ py: "8px" }}
          >
            {selectedExecution?.is_favorite ? (
              <SavedSpark
                size="32"
                color={palette.onSurface}
                opacity={1}
              />
            ) : (
              <DraftSpark
                size="32"
                color={palette.onSurface}
                opacity={1}
              />
            )}
            <Stack>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 18,
                  color: `${alpha(palette.onSurface, 0.8)}`,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {executionTitle}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: 12,
                  color: "onSurface",
                  opacity: 0.5,
                }}
              >
                {!selectedExecution?.is_favorite &&
                  `This Spark is temporal and will be removed in 
                        ${moment
                          .duration(
                            moment(selectedExecution?.created_at)
                              .add(30, "days")
                              .diff(moment()),
                          )
                          .humanize()}`}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            flexDirection={"row"}
            alignItems={"flex-start"}
            gap={1}
            sx={{ py: "8px" }}
          >
            <Button
              variant="text"
              startIcon={<Create />}
              sx={{
                border: `1px solid ${alpha(palette.primary.main, 0.15)}`,
                bgcolor: "transparent",
                color: "onSurface",
                fontSize: 13,
                fontWeight: 500,
                p: "4px 12px",
              }}
              onClick={() => setRenameAllow(true)}
            >
              Rename
            </Button>
            <Button
              variant="text"
              startIcon={<CloudQueue />}
              sx={{
                border: `1px solid ${alpha(palette.primary.main, 0.15)}`,
                bgcolor: "transparent",
                color: "onSurface",
                fontSize: 13,
                fontWeight: 500,
                p: "4px 12px",
              }}
              disabled={selectedExecution?.is_favorite}
              onClick={saveExecution}
            >
              {selectedExecution?.is_favorite ? "Saved" : "Save"}
            </Button>
            <Button
              variant="text"
              startIcon={<Delete />}
              sx={{
                border: `1px solid ${alpha(palette.primary.main, 0.15)}`,
                bgcolor: "transparent",
                color: "onSurface",
                fontSize: 13,
                fontWeight: 500,
                p: "4px 12px",
                ml: "auto",
              }}
              onClick={() => setDeleteAllow(true)}
            >
              Delete
            </Button>
          </Stack>
        </Box>
        {renameAllow && (
          <Box>
            <Box sx={{ py: "8px" }}>
              <TextField
                variant="standard"
                fullWidth
                label="Rename Spark"
                value={executionTitle}
                onChange={e => setExecutionTitle(e.target.value)}
              />
            </Box>
            <Stack
              flexDirection={"row"}
              alignItems={"flex-start"}
              gap={1}
              sx={{ py: "8px" }}
            >
              <Button
                variant="contained"
                startIcon={<Done />}
                sx={{
                  borderColor: "primary.main",
                  bgcolor: "primary.main",
                  color: "onPrimary",
                  fontSize: 13,
                  fontWeight: 500,
                  p: "4px 12px",
                  ":hover": { color: "primary.main" },
                  ":disabled": { bgcolor: "transparent", borderColor: alpha(palette.primary.main, 0.15) },
                }}
                disabled={!!!executionTitle?.length || isLoading}
                onClick={renameSave}
              >
                Ok
              </Button>
              <Button
                variant="text"
                sx={{
                  border: `1px solid ${alpha(palette.primary.main, 0.15)}`,
                  bgcolor: "transparent",
                  color: "onSurface",
                  fontSize: 13,
                  fontWeight: 500,
                  p: "4px 12px",
                }}
                disabled={isLoading}
                onClick={() => {
                  setRenameAllow(false);
                  setExecutionTitle(selectedExecution?.title);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
      <Tabs
        value={tabsValue}
        onChange={changeTab}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{ boxShadow: "0px -1px 0px 0px #ECECF4 inset" }}
      >
        <Tab
          label="All Sparks"
          {...a11yProps(0)}
          sx={{ ...tabStyle, color: `${alpha(palette.onSurface, 0.4)}` }}
        />
        <Tab
          label="Saved"
          {...a11yProps(1)}
          icon={<CloudQueue />}
          iconPosition="start"
          sx={{ ...tabStyle, color: `${alpha(palette.onSurface, 0.4)}` }}
        />
      </Tabs>
      <CustomTabPanel
        value={tabsValue}
        index={0}
      >
        <Stack height={"100%"}>
          {ExecutionsList(executions)}
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "surface.2",
              color: "onSurface",
              p: "8px 16px",
            }}
          >
            <PriorityHighOutlined style={{ fontSize: 24, opacity: 0.75 }} />
            <Typography sx={{ fontSize: 12, fontWeight: 400, color: "onSurface", opacity: 0.5 }}>
              Unsaved Sparks are recorded for 30 days
            </Typography>
          </Stack>
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel
        value={tabsValue}
        index={1}
      >
        <Stack height={"100%"}>{ExecutionsList(pinnedExecutions)}</Stack>
      </CustomTabPanel>

      {!!selectedExecution && (
        <DeleteDialog
          open={deleteAllow}
          dialogTitle="Delete Spark"
          dialogContentText={`Are you sure you want to delete ${selectedExecution?.title || "this"} Spark?`}
          onClose={() => setDeleteAllow(false)}
          onSubmit={() => {
            deleteExecution({ id: selectedExecution.id });
            setDeleteAllow(false);
          }}
          onSubmitLoading={isLoading}
        />
      )}
    </Box>
  );
};

const tabStyle = {
  fontSize: 14,
  fontWeight: 500,
  textTransform: "none",
  p: "17px 16px",
  minHeight: "auto",
};
