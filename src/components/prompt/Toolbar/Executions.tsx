import { SyntheticEvent, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { CardExecution } from "@/components/common/cards/CardExecution";
import { CardExecutionPlaceholder } from "@/components/placeholders/CardExecutionPlaceholder";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { isValidUserFn } from "@/core/store/userSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setGeneratedExecution, setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { openToolbarDrawer, setAccordionChatMode } from "@/core/store/templatesSlice";
import { isDesktopViewPort } from "@/common/helpers";

interface ExecutionsProps {
  template: Templates;
  executions: TemplatesExecutions[];
  isExecutionsLoading: boolean;
  refetchTemplateExecutions: () => void;
}

export const Executions: React.FC<ExecutionsProps> = ({ template }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const {
    data: executions,
    isLoading: isExecutionsLoading,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

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

  const isMobile = !isDesktopViewPort();

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

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filteredExecutions: TemplatesExecutions[] | undefined = executions?.filter(execution =>
    selectedTab === 0 ? execution.is_favorite : !execution.is_favorite,
  );

  const handleClick = (execution: TemplatesExecutions) => {
    dispatch(setSelectedExecution(execution));
    dispatch(setAccordionChatMode("execution"));

    isMobile && dispatch(openToolbarDrawer(false));
  };

  return (
    <Stack
      gap={2}
      p={"0px 24px"}
    >
      {isExecutionsLoading ? (
        Array.from({ length: 2 }, (_, i) => <CardExecutionPlaceholder key={i} />)
      ) : executions && executions.length > 0 ? (
        <>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="execution tabs"
          >
            <Tab
              label="Saved"
              sx={{
                minWidth: "40px",
              }}
            />
            <Tab
              label="Unsaved"
              sx={{
                minWidth: "40px",
              }}
            />
          </Tabs>
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {filteredExecutions?.map(execution => (
              <ListItem
                onClick={() => handleClick(execution)}
                sx={{ borderRadius: "8px", overflow: "hidden" }}
                key={execution.id}
                disablePadding
              >
                <ListItemButton
                  selected={selectedExecution?.id === execution.id}
                  sx={{
                    p: 1,
                  }}
                >
                  <CardExecution execution={execution} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
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
          No spark found
        </Typography>
      )}
      {filteredExecutions?.length === 0 && executions?.length! > 0 && (
        <Typography
          sx={{
            mt: "20svh",
            textAlign: "center",
            fontSize: 12,
            fontWeight: 400,
            color: "onSurface",
          }}
        >
          {selectedTab === 0 ? "No saved executions found." : "No unsaved executions found."}
        </Typography>
      )}
    </Stack>
  );
};
