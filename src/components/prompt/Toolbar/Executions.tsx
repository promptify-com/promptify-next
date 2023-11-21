import { SyntheticEvent, useState } from "react";
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
import { Templates } from "@/core/api/dto/templates";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { isValidUserFn } from "@/core/store/userSlice";
import { useAppSelector } from "@/hooks/useStore";

interface ExecutionsProps {
  template: Templates;
}

export const Executions: React.FC<ExecutionsProps> = ({ template }) => {
  const isValidUser = useAppSelector(isValidUserFn);
  const [selectedTab, setSelectedTab] = useState(0);

  const { data: executions, isLoading } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

  const hasSavedExecutions = executions?.some(execution => execution.is_favorite);
  const hasUnsavedExecutions = executions?.some(execution => !execution.is_favorite);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filteredExecutions = executions?.filter(execution => {
    if (selectedTab === 0) return true;
    return selectedTab === 1 ? execution.is_favorite : !execution.is_favorite;
  });

  return (
    <Stack
      width={"300px"}
      gap={2}
      p={"0px 24px"}
    >
      {isLoading ? (
        Array.from({ length: 2 }, (_, i) => <CardExecutionPlaceholder key={i} />)
      ) : executions && executions.length > 0 ? (
        <>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="execution tabs"
          >
            <Tab
              label="All"
              sx={{
                minWidth: "40px",
              }}
            />
            {hasSavedExecutions && (
              <Tab
                sx={{
                  minWidth: "40px",
                }}
                label="Saved"
              />
            )}
            {hasUnsavedExecutions && (
              <Tab
                sx={{
                  minWidth: "40px",
                }}
                label="Unsaved"
              />
            )}
          </Tabs>
          <List>
            {filteredExecutions?.map(execution => (
              <ListItem
                key={execution.id}
                disablePadding
              >
                <ListItemButton
                  sx={{
                    py: "10px",
                    px: "0.5px",
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
          No sparks yet
        </Typography>
      )}
    </Stack>
  );
};
