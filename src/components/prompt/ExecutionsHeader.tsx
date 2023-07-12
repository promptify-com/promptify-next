import React, { useState } from 'react'
import { Box, Button, ClickAwayListener, Grow, IconButton, InputBase, InputLabel, Paper, Popper, Stack, Typography, alpha, useTheme } from '@mui/material'
import { Search as SearchIcon, PushPinOutlined, FeedOutlined, ArrowDropUp, ArrowDropDown, Undo, Redo, PushPin, Close } from "@mui/icons-material";
import { SubjectIcon } from "@/assets/icons/SubjectIcon";
import { TemplatesExecutions } from '@/core/api/dto/templates';
import { ExecutionsTabs } from './ExecutionsTabs';

interface Props {
   executions: TemplatesExecutions[];
   selectedExecution: TemplatesExecutions | null;
   changeSelectedExecution: (execution: TemplatesExecutions) => void;
   pinExecution: () => void;
}

export const ExecutionsHeader: React.FC<Props> = ({ 
   executions,
   selectedExecution,
   changeSelectedExecution,
   pinExecution
 }) => {
   const  { palette } = useTheme();
   
   const [searchShown, setSearchShown] = useState(false);
   const [searchText, setSearchText] = useState("");
   const [presetsAnchor, setPresetsAnchor] = useState<HTMLElement | null>(null);

   return (
      <Box sx={{ 
            position: "sticky", top: 0, left: 0, right: 0, zIndex: 998,
            p: "16px 16px 16px 24px", 
            bgcolor: "surface.1",
            boxShadow: "0px -1px 0px 0px #ECECF4 inset"
         }}
      >
         <Box sx={{ position: "relative" }}>
            <Stack
               direction={"row"}
               alignItems={"center"}
               gap={1}
            >
               <IconButton sx={{ ...iconButtonStyle, opacity: .5 }}
                  onClick={pinExecution}
               >
                  {selectedExecution?.is_favorite ? <PushPin /> : <PushPinOutlined />}
               </IconButton>
               <Button
                  sx={{ 
                     width: "360px",
                     color: "onSurface", 
                     fontSize: 13, 
                     fontWeight: 500,
                     justifyContent: "space-between",
                     ":hover": { bgcolor: "action.hover" }
                  }}
                  startIcon={<FeedOutlined />}
                  endIcon={Boolean(presetsAnchor) ? <ArrowDropUp /> : <ArrowDropDown />}
                  variant={"text"}
                  onClick={(e) => setPresetsAnchor(e.currentTarget)}
               >
                  <Box sx={{ width: "80%", overflow: "hidden", textAlign: "left" }}>
                     {selectedExecution?.title || "Choose execution"}
                  </Box>
               </Button>
               <Popper
                  open={Boolean(presetsAnchor)}
                  anchorEl={presetsAnchor}
                  transition
                  disablePortal
               >
                  {({ TransitionProps, placement }) => (
                     <Grow {...TransitionProps} style={{ transformOrigin: "center top" }}>
                        <Paper
                           sx={{
                              bgcolor: "surface.1",
                              borderRadius: "16px",
                              overflow: "hidden",
                              boxShadow: "0px 10px 13px -6px rgba(0, 0, 0, 0.20), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)"
                           }}
                           elevation={0}
                        >
                           <ClickAwayListener onClickAway={() => setPresetsAnchor(null)}>
                              <Box>
                                 <ExecutionsTabs 
                                    executions={executions}
                                    chooseExecution={(exec) => {
                                       console.log(exec)
                                       changeSelectedExecution(exec)
                                       setPresetsAnchor(null)
                                    }}
                                 />
                              </Box>
                           </ClickAwayListener>
                        </Paper>
                     </Grow>
                  )}
               </Popper>
               <IconButton sx={{ ...iconButtonStyle, ml: "auto" }}
                  onClick={() => setSearchShown(!searchShown)}
               >
                  <SearchIcon />
               </IconButton>
               {false && (
               <React.Fragment>
               <Typography sx={{ color: `${alpha(palette.onSurface, .2)}`, fontSize: 12, fontWeight: 400 }}>
                  saved...
               </Typography>
               <IconButton sx={{ ...iconButtonStyle }}>
                  <Undo />
               </IconButton>
               <IconButton sx={{ ...iconButtonStyle }}>
                  <Redo />
               </IconButton>
               <Button
                  sx={{ color: "onSurface", fontSize: 13, fontWeight: 500 }}
                  startIcon={<FeedOutlined />}
                  endIcon={Boolean(presetsAnchor) ? <ArrowDropUp /> : <ArrowDropDown />}
                  variant={"text"}
                  onClick={(e) => setPresetsAnchor(e.currentTarget)}
               >
                  Export
               </Button> 
               </React.Fragment>
               )}
            </Stack>
            
            {searchShown && (
            <Stack direction={"row"} alignItems={"center"} spacing={2}
               sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bgcolor: "surface.4",
                  p: "5px 10px",
                  borderRadius: "99px",
                  color: "onSurface",
               }}
            >
               <SubjectIcon />
               <InputBase
                  id="exec"
                  placeholder={"Search..."}
                  fullWidth
                  sx={{
                     flex: 1,
                     fontSize: 13, 
                     fontWeight: 500,
                     padding: "0px",
                  }}
                  value={searchText}
                  onChange={(e) => {
                  setSearchText(e.target.value);
                  }}
               />
               <Button
                  variant="text"
                  sx={{
                     minWidth: 0,
                     p: 0,
                     color: "onSurface",
                     fontSize: 13,
                     fontWeight: 500,
                     "&:hover": { opacity: 0.8 },
                  }}
                  disabled={!searchText.length}
                  onClick={() => setSearchText("")}
               >
                  Clear
               </Button>
               <IconButton sx={{ border: "none", p: 0, ":hover": { color: "tertiary" } }}
                  onClick={() => setSearchShown(false)}
               >
                  <Close />
               </IconButton>
            </Stack>
            )}
         </Box>
      </Box>
   )
}

const iconButtonStyle = { 
   border: "none", 
   p: "8px", 
   color: "onBackground",
   opacity: .8,
   ":hover": { opacity: 1, color: "onBackground" } 
}