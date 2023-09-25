import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
  Palette,
} from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { CloudQueue, Create, Delete, PriorityHighOutlined } from "@mui/icons-material";
import moment from "moment";
import SavedSpark from "@/assets/icons/SavedSpark";
import DraftSpark from "@/assets/icons/DraftSpark";
import {
  useDeleteExecutionMutation,
  useExecutionFavoriteMutation,
  useUpdateExecutionMutation,
} from "@/core/api/executions";
import { DeleteDialog } from "../dialog/DeleteDialog";
import { executionTimeLeft } from "@/common/helpers/executionTimeLeft";
import { RenameForm } from "../common/forms/RenameForm";
import useTruncate from "@/hooks/useTruncate";

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
  sparkHashQueryParam: string | null;
}

interface ExecutionCardProps {
  chooseExecution: (execution: TemplatesExecutions) => void;
  selectedExecution: TemplatesExecutions | null;
  palette: Palette;
  setExecutionToDelete: React.Dispatch<React.SetStateAction<TemplatesExecutions | null>>;
  setDeleteAllow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExecutionCard = ({
  execution,
  chooseExecution,
  selectedExecution,
  palette,
  setExecutionToDelete,
  setDeleteAllow,
}: ExecutionCardProps & { execution: TemplatesExecutions }) => {
  const { truncate } = useTruncate();

  return (
    <MenuItem
      key={execution.id}
      sx={{
        borderTop: "1px solid #E3E3E3",
        p: "16px",
        opacity: 0.85,
        "&:hover": {
          opacity: 1,
          bgcolor: "surface.2",
          ".delete-btn": {
            display: "inline-flex",
          },
        },
      }}
      onClick={() => chooseExecution(execution)}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
        width={"100%"}
      >
        {execution.is_favorite ? (
          <SavedSpark
            size="32"
            color={execution.id === selectedExecution?.id ? palette.primary.main : palette.onSurface}
          />
        ) : (
          <DraftSpark
            size="32"
            color={execution.id === selectedExecution?.id ? palette.primary.main : palette.onSurface}
          />
        )}
        <Stack>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 14,
              color: execution.id === selectedExecution?.id ? "primary.main" : "onSurface",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {truncate(execution.title, { length: 35 })}
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
        <IconButton
          className="delete-btn"
          sx={{
            display: "none",
            ml: "auto",
            border: "none",
            "&:hover": {
              bgcolor: "surface.5",
            },
          }}
          onClick={e => {
            e.stopPropagation();
            setExecutionToDelete(execution);
            setDeleteAllow(true);
          }}
        >
          <Delete sx={{ fontSize: "16px" }} />
        </IconButton>
      </Stack>
    </MenuItem>
  );
};

const ExecutionsList = ({
  executions,
  chooseExecution,
  selectedExecution,
  palette,
  setExecutionToDelete,
  setDeleteAllow,
}: ExecutionCardProps & { executions: TemplatesExecutions[] }) => (
  <MenuList
    sx={{
      flex: 1,
      p: 0,
      overflow: "auto",
      overscrollBehavior: "contain",
    }}
  >
    {executions.length ? (
      executions.map(exec => (
        <ExecutionCard
          key={exec.id}
          execution={exec}
          chooseExecution={chooseExecution}
          palette={palette}
          setExecutionToDelete={setExecutionToDelete}
          setDeleteAllow={setDeleteAllow}
          selectedExecution={selectedExecution}
        />
      ))
    ) : (
      <Stack sx={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ color: "onSurface", opacity: 0.5 }}>No sparks found</Typography>
      </Stack>
    )}
  </MenuList>
);

export const ExecutionsTabs: React.FC<Props> = ({
  executions,
  chooseExecution,
  selectedExecution,
  sparkHashQueryParam,
}) => {
  const { palette } = useTheme();

  const [updateExecution, { isError, isLoading }] = useUpdateExecutionMutation();
  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecution] = useDeleteExecutionMutation();
  const [tabsValue, setTabsValue] = useState(0);
  const changeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };
  const [executionTitle, setExecutionTitle] = useState(selectedExecution?.title);
  const [renameAllow, setRenameAllow] = useState(false);
  const [deleteAllow, setDeleteAllow] = useState(false);
  const [executionToDelete, setExecutionToDelete] = useState<TemplatesExecutions | null>(null);
  const [allExecutions, savedExecutions] = useMemo(() => {
    const _executions = executions
      .reduce((uniqueExecs: TemplatesExecutions[], execution) => {
        if (!uniqueExecs.some((item: TemplatesExecutions) => item.id === execution.id)) {
          uniqueExecs.push(execution);
        }
        return uniqueExecs;
      }, [])
      .sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));
    const savedExecutions = _executions.filter(execution => execution.is_favorite);

    return [_executions, savedExecutions];
  }, [executions]);

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

  const saveExecution = async () => {
    if (!!!selectedExecution || selectedExecution?.is_favorite) return;

    try {
      await favoriteExecution(selectedExecution.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ width: { xs: "90svw", md: "401px" } }}>
      {!sparkHashQueryParam && !!selectedExecution && (
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
                  {!selectedExecution?.is_favorite
                    ? `This Spark is temporal and will be removed in ${executionTimeLeft(
                        selectedExecution.created_at as Date,
                      )}`
                    : "This Spark is saved"}
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
                onClick={() => {
                  setExecutionToDelete(selectedExecution);
                  setDeleteAllow(true);
                }}
              >
                Delete
              </Button>
            </Stack>
          </Box>
          {renameAllow && (
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
        </Box>
      )}
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
          <ExecutionsList
            executions={allExecutions}
            chooseExecution={chooseExecution}
            palette={palette}
            setExecutionToDelete={setExecutionToDelete}
            setDeleteAllow={setDeleteAllow}
            selectedExecution={selectedExecution}
          />
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
        <Stack height={"100%"}>
          <ExecutionsList
            executions={savedExecutions}
            chooseExecution={chooseExecution}
            palette={palette}
            setExecutionToDelete={setExecutionToDelete}
            setDeleteAllow={setDeleteAllow}
            selectedExecution={selectedExecution}
          />
        </Stack>
      </CustomTabPanel>

      {!!executionToDelete && (
        <DeleteDialog
          open={deleteAllow}
          dialogTitle="Delete Spark"
          dialogContentText={`Are you sure you want to delete ${executionToDelete?.title || "this"} Spark?`}
          onClose={() => {
            setDeleteAllow(false);
            setExecutionToDelete(null);
          }}
          onSubmit={async () => {
            await deleteExecution(executionToDelete.id);
            setDeleteAllow(false);
            setExecutionToDelete(null);
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
