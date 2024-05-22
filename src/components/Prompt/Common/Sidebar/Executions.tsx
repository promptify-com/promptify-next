import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { CardExecutionPlaceholder } from "@/components/placeholders/CardExecutionPlaceholder";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { isValidUserFn } from "@/core/store/userSlice";
import { useAppSelector } from "@/hooks/useStore";
import { ExecutionItem } from "./ExecutionItem";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";

interface ExecutionsProps {
  template: Templates;
}

const Executions: React.FC<ExecutionsProps> = ({ template }) => {
  const router = useRouter();
  const activeVariant = router.query.variant;
  const selectedExecution = useAppSelector(state => state.executions?.selectedExecution ?? null);

  const isValidUser = useAppSelector(isValidUserFn);

  const [selectedTab, setSelectedTab] = useState(0);

  const { data: executions, isLoading: isExecutionsLoading } = useGetExecutionsByTemplateQuery(
    isValidUser ? template.id : skipToken,
  );

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filteredExecutions: TemplatesExecutions[] | undefined = executions?.filter(execution =>
    selectedTab === 0 ? execution.is_favorite : !execution.is_favorite,
  );

  return (
    <Stack
      gap={2}
      p={"0px 24px"}
    >
      {isExecutionsLoading ? (
        <CardExecutionPlaceholder count={2} />
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

          {activeVariant === "a" ? (
            <Stack
              gap={2}
              py={"24px"}
            >
              {filteredExecutions?.map(execution => (
                <ExecutionItem
                  key={execution.id}
                  variant="a"
                  execution={execution}
                  promptsData={template.prompts}
                />
              ))}
            </Stack>
          ) : (
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {filteredExecutions?.map(execution => (
                <ListItem
                  sx={{ borderRadius: "8px", overflow: "hidden" }}
                  key={execution.id}
                  disablePadding
                >
                  <ListItemButton
                    selected={selectedExecution?.id === execution.id}
                    sx={{
                      p: 0,
                    }}
                  >
                    <ExecutionItem
                      key={execution.id}
                      variant="b"
                      execution={execution}
                      promptsData={template.prompts}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
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
          No work found
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
          {selectedTab === 0 ? "No saved works found." : "No unsaved works found."}
        </Typography>
      )}
    </Stack>
  );
};

export default Executions;
