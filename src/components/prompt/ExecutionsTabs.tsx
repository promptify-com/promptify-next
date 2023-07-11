import React from 'react'
import { Box, MenuItem, MenuList, Tab, Tabs, Typography, alpha, useTheme } from '@mui/material'
import { TemplatesExecutions } from '@/core/api/dto/templates';
import { PushPin, PushPinOutlined } from '@mui/icons-material';

interface Props {
   executions: TemplatesExecutions[];
   chooseExecution: (execution: TemplatesExecutions) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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
            <MenuList sx={{ p: 0 }}>
            {executions.map((exec) => (
               <MenuItem key={exec.id}
                  sx={{ borderTop: "1px solid #E3E3E3" }}
                  onClick={() => chooseExecution(exec)}
               >
                  <Typography sx={{
                     fontWeight: 500,
                     fontSize: 14,
                     ml: "1rem",
                     color: "onSurface",
                  }}
                  >
                  The Mysterious Dragon and the Brave Friends
                  </Typography>
               </MenuItem>
            ))}
            </MenuList>
         </CustomTabPanel>
         <CustomTabPanel value={tabsValue} index={1}>
         </CustomTabPanel>
         <CustomTabPanel value={tabsValue} index={2}>
            Item Three
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