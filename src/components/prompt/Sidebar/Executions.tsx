import { CardExecution } from "@/components/common/cards/CardExecution";
import { CardExecutionPlaceholder } from "@/components/placeholders/CardExecutionPlaceholder";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { setGeneratedExecution, setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { useAppSelector } from "@/hooks/useStore";
import { theme } from "@/theme";
import { CloudQueue } from "@mui/icons-material";
import { Box, Stack, Tab, Tabs, Typography, alpha } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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

interface ExecutionsProps {
  template: Templates;
  executions: TemplatesExecutions[] | undefined;
  isExecutionsLoading: boolean;
  refetchTemplateExecutions: () => void;
  onSelectExecution: () => void;
}

export const Executions: React.FC<ExecutionsProps> = ({
  template,
  executions,
  isExecutionsLoading,
  refetchTemplateExecutions,
  onSelectExecution,
}) => {
  const dispatch = useDispatch();
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const [tabsValue, setTabsValue] = useState(0);
  const changeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  const handleSelectExecution = ({
    execution,
    resetHash = false,
  }: {
    execution: TemplatesExecutions | null;
    resetHash?: boolean;
  }) => {
    if (resetHash) {
      dispatch(setSparkHashQueryParam(null));
    }

    dispatch(setSelectedExecution(execution));
  };

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const promptNotCompleted = generatedExecution.data.find(execData => !execData.isCompleted);

      if (!promptNotCompleted) {
        dispatch(setSelectedExecution(null));
        dispatch(setGeneratedExecution(null));
        refetchTemplateExecutions();
      }
    }
  }, [isGenerating, generatedExecution]);

  useEffect(() => {
    if (!executions) {
      return;
    }

    const wantedExecutionId = selectedExecution?.id.toString();

    if (wantedExecutionId) {
      const _selectedExecution = executions.find(exec => exec.id.toString() === wantedExecutionId);

      handleSelectExecution({ execution: _selectedExecution || null, resetHash: true });
    } else {
      handleSelectExecution({ execution: template.example_execution || null, resetHash: true });
    }
  }, [executions]);

  const savedExecutions = executions?.filter(exec => exec.is_favorite);
  const unsavedExecutions = executions?.filter(exec => !exec.is_favorite);

  return (
    <Stack px={"24px"}>
      {isExecutionsLoading ? (
        Array.from({ length: 2 }, (_, i) => <CardExecutionPlaceholder key={i} />)
      ) : (
        <>
          <Tabs
            value={tabsValue}
            onChange={changeTab}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{ position: "sticky", top: 67, zIndex: 1, bgcolor: "surface.1" }}
          >
            <Tab
              label="Saved"
              {...a11yProps(0)}
              icon={<CloudQueue />}
              iconPosition="start"
              sx={{ ...tabStyle, color: `${alpha(theme.palette.onSurface, 0.4)}` }}
            />
            <Tab
              label="Unsaved"
              {...a11yProps(1)}
              sx={{ ...tabStyle, color: `${alpha(theme.palette.onSurface, 0.4)}` }}
            />
          </Tabs>
          <CustomTabPanel
            value={tabsValue}
            index={0}
          >
            <Stack
              gap={2}
              py={"24px"}
            >
              {savedExecutions && savedExecutions.length > 0 ? (
                savedExecutions.map(execution => (
                  <CardExecution
                    key={execution.id}
                    execution={execution}
                    onClick={onSelectExecution}
                  />
                ))
              ) : (
                <Typography
                  sx={{
                    mt: "20svh",
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "onSurface",
                  }}
                >
                  No works yet
                </Typography>
              )}
            </Stack>
          </CustomTabPanel>
          <CustomTabPanel
            value={tabsValue}
            index={1}
          >
            <Stack
              gap={2}
              py={"24px"}
            >
              {unsavedExecutions && unsavedExecutions.length > 0 ? (
                unsavedExecutions.map(execution => (
                  <CardExecution
                    key={execution.id}
                    execution={execution}
                    onClick={onSelectExecution}
                  />
                ))
              ) : (
                <Typography
                  sx={{
                    mt: "20svh",
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "onSurface",
                  }}
                >
                  No works yet
                </Typography>
              )}
            </Stack>
          </CustomTabPanel>
        </>
      )}
    </Stack>
  );
};

const tabStyle = {
  fontSize: 12,
  fontWeight: 500,
  textTransform: "none",
  p: "12px 16px",
  minHeight: "auto",
};
