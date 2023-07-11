import React from 'react'
import { Box, MenuItem, MenuList, Stack, Tab, Tabs, Typography, alpha, useTheme } from '@mui/material'
import { TemplatesExecutions } from '@/core/api/dto/templates';
import { FeedOutlined, PushPin } from '@mui/icons-material';
import moment from 'moment';

interface Props {
   executions: TemplatesExecutions[];
   chooseExecution: (execution: TemplatesExecutions) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
         {...other}
      >
         {value === index && (
            <React.Fragment>
               {children}
            </React.Fragment>
         )}
      </div>
   );
}

function a11yProps(index: number) {
   return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
   };
}

export const ExecutionsTabs:React.FC<Props> = ({ executions, chooseExecution }) => {
   const { palette } = useTheme();

   const [tabsValue, setTabsValue] = React.useState(0);
   const changeTab = (e: React.SyntheticEvent, newValue: number) => {
      setTabsValue(newValue);
   };


   const ExecutionCard = ({ execution }: { execution: TemplatesExecutions }) => {
      return (
         <MenuItem key={execution.id}
            sx={{ 
               borderTop: "1px solid #E3E3E3", 
               p: "16px",
               opacity: .8,
               "&:hover": { opacity: 1 }
            }}
            onClick={() => chooseExecution(execution)}
         >
            <Stack direction={"row"} alignItems={"center"} gap={2}>
               <FeedOutlined style={{ fontSize: 32 }} />
               <Stack>
                  <Typography sx={{
                     fontWeight: 500,
                     fontSize: 14,
                     color: "onSurface",
                     whiteSpace: "normal",
                     wordBreak: "break-word"
                  }}
                  >
                     The Mysterious Dragon and the Brave Friends
                  </Typography>
                  <Typography sx={{
                     fontWeight: 400,
                     fontSize: 12,
                     color: "onSurface",
                     opacity: .5
                  }}
                  >
                     {moment(execution.created_at).fromNow()}
                  </Typography>
               </Stack>
            </Stack>
         </MenuItem>
      )
   }

  return (
      <Box sx={{ width: "360px" }}>
         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
               value={tabsValue} 
               onChange={changeTab}
               textColor="primary"
               indicatorColor="primary"
               variant="fullWidth"
            >
               <Tab label="All Sparks" {...a11yProps(0)} 
                  sx={{ ...tabStyle, color: `${alpha(palette.onSurface, .4)}` }}
               />
               <Tab label="Pinned" {...a11yProps(1)} icon={<PushPin />} iconPosition='start'
                  sx={{ ...tabStyle, color: `${alpha(palette.onSurface, .4)}` }}
               />
               <Tab label="New Spark" {...a11yProps(2)} 
                  sx={{ ...tabStyle, color: `${alpha(palette.onSurface, .4)}` }}
               />
            </Tabs>
         </Box>
         <CustomTabPanel value={tabsValue} index={0}>
            <MenuList sx={{ 
               p: 0, 
               maxHeight: "50svh", 
               overflow: "auto",
               overscrollBehavior: "contain"
            }}>
            {executions.map((exec) => (
               <ExecutionCard execution={exec} />
            ))}
            </MenuList>
         </CustomTabPanel>
         <CustomTabPanel value={tabsValue} index={1}>
            <MenuList sx={{ 
               p: 0, 
               maxHeight: "50svh", 
               overflow: "auto",
               overscrollBehavior: "contain"
            }}>
            {executions.map((exec) => (
               <ExecutionCard execution={exec} />
            ))}
            </MenuList>
         </CustomTabPanel>
         <CustomTabPanel value={tabsValue} index={2}>
            <MenuList sx={{ 
               p: 0, 
               maxHeight: "50svh", 
               overflow: "auto",
               overscrollBehavior: "contain"
            }}>
            {executions.map((exec) => (
               <ExecutionCard execution={exec} />
            ))}
            </MenuList>
         </CustomTabPanel>
      </Box>
  )
}

const tabStyle = {
   fontSize: 14, 
   fontWeight: 500, 
   textTransform: "none",
   p: "17px 16px",
   minHeight: "auto"
}