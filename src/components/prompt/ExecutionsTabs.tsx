import React from "react";
import { Box, Button, MenuItem, MenuList, Stack, Tab, Tabs, Typography, alpha, useTheme } from "@mui/material";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import { CloudQueue, Create, Delete, PriorityHighOutlined, PushPin } from "@mui/icons-material";
import moment from "moment";
import SavedSpark from "@/assets/icons/SavedSpark";
import DraftSpark from "@/assets/icons/DraftSpark";

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

  const [tabsValue, setTabsValue] = React.useState(0);
  const changeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
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
              {selectedExecution?.title}
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
          >
            Save
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
          >
            Delete
          </Button>
        </Stack>
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
