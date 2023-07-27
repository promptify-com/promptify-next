import React, { useState } from 'react'
import { Box, Button, ClickAwayListener, Collapse, Grow, IconButton, InputBase, InputLabel, Paper, Popper, Stack, Typography, alpha, useTheme } from '@mui/material'
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

   const SearchInput = (
               
      <Stack direction={"row"} alignItems={"center"} ml="auto">
         <Collapse orientation="horizontal" in={searchShown}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}
               sx={{
                  position: "sticky",
                  top: 0,
                  right: 0,
                  bgcolor: "surface.2",
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
                     fontWeight: 400
                  }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
               />
            </Stack>
         </Collapse>
         <IconButton sx={{ ...iconButtonStyle }}
            onClick={() => setSearchShown(!searchShown)}
         >
            {searchShown ? <Close /> : <SearchIcon />}
         </IconButton>
      </Stack>
   )

   const SparksSelect = (
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
   )

   const FavoriteButton = (
      <IconButton sx={{ ...iconButtonStyle, opacity: .5 }}
         onClick={pinExecution}
      >
         {selectedExecution?.is_favorite ? <PushPin /> : <PushPinOutlined />}
      </IconButton>
   )

   return (
      <Box sx={{ 
            position: "sticky", top: 0, left: 0, right: 0, zIndex: 998,
            p: "16px 16px 16px 24px", 
            bgcolor: "surface.1",
            boxShadow: "0px -1px 0px 0px #ECECF4 inset"
         }}
      >
         <Box sx={{ position: "relative" }}>

            {/* Big screen header */}
            <Stack
               display={{ xs: "none", md: "flex" }}
               direction={"row"}
               alignItems={"center"}
               gap={1}
            >
               {FavoriteButton}

               {SparksSelect}

               {SearchInput}

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

            {/* Small screen header */}
            <Stack
               display={{ md: "none" }}
               direction={"row"}
               alignItems={"center"}
               gap={1}
            >
               {SparksSelect}
            </Stack>

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