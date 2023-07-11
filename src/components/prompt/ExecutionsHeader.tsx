import React, { useState } from 'react'
import { Box, Button, ClickAwayListener, Grow, IconButton, InputBase, InputLabel, MenuItem, MenuList, Paper, Popper, Stack, Typography, alpha, useTheme } from '@mui/material'
import { Search as SearchIcon, PushPinOutlined, FeedOutlined, ArrowDropUp, ArrowDropDown, Undo, Redo } from "@mui/icons-material";
import { SubjectIcon } from "@/assets/icons/SubjectIcon";
import { TemplatesExecutions } from '@/core/api/dto/templates';

interface Props {
   executions: TemplatesExecutions[];
}

export const ExecutionsHeader: React.FC<Props> = ({ 
   executions
 }) => {
   const  { palette } = useTheme();
   const [searchShown, setSearchShown] = useState(false);
   const [searchText, setSearchText] = useState("");
   const [presetsAnchor, setPresetsAnchor] = useState<HTMLElement | null>(null);

   return (
      <Box sx={{ 
            p: "16px 16px 16px 24px", 
            boxShadow: "0px -1px 0px 0px #ECECF4 inset"
         }}
      >
         <Box sx={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 998 }}>
            <Stack
               direction={"row"}
               alignItems={"center"}
               gap={1}
            >
               <IconButton sx={{ border: "none", p: 0, ":hover": { color: "onBackground" } }}>
                  <PushPinOutlined />
               </IconButton>
               <Button
                  sx={{ color: "onSurface", fontSize: 13, fontWeight: 500 }}
                  startIcon={<FeedOutlined />}
                  endIcon={Boolean(presetsAnchor) ? <ArrowDropUp /> : <ArrowDropDown />}
                  variant={"text"}
                  onClick={(e) => setPresetsAnchor(e.currentTarget)}
               >
                  The Mysterious Dragon and the Brave Friends
               </Button>
               <Popper
                  open={Boolean(presetsAnchor)}
                  anchorEl={presetsAnchor}
                  transition
                  disablePortal
                  sx={{ zIndex: 9 }}
               >
                  {({ TransitionProps, placement }) => (
                     <Grow
                     {...TransitionProps}
                     style={{ transformOrigin: "center top" }}
                     >
                     <Paper
                        sx={{
                           bgcolor: "surface.1",
                           border: "1px solid #E3E3E3",
                           borderRadius: "10px",
                           maxHeight: "30svh",
                           overflow: "auto",
                           overscrollBehavior: "contain"
                        }}
                        elevation={0}
                     >
                        <ClickAwayListener
                           onClickAway={() => setPresetsAnchor(null)}
                        >
                           <MenuList
                           sx={{ paddingRight: "3rem", width: "100%" }}
                           >
                           {executions.map((exec) => (
                              <MenuItem
                                 key={exec.id}
                                 sx={{ borderTop: "1px solid #E3E3E3" }}
                                 onClick={() => setPresetsAnchor(null)}
                              >
                                 <Typography
                                 sx={{
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
                        </ClickAwayListener>
                     </Paper>
                     </Grow>
                  )}
               </Popper>
               <Typography sx={{ color: `${alpha(palette.onSurface, .2)}`, fontSize: 12, fontWeight: 400 }}>
                  saved...
               </Typography>
               <IconButton sx={{ ml: "auto", border: "none", p: "8px", ":hover": { color: "onBackground" } }}>
                  <SearchIcon />
               </IconButton>
               <IconButton sx={{ border: "none", p: "8px", ":hover": { color: "onBackground" } }}>
                  <Undo />
               </IconButton>
               <IconButton sx={{ border: "none", p: "8px", ":hover": { color: "onBackground" } }}>
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
            </Stack>
            
            {searchShown && (
            <Stack
               direction={"row"}
               alignItems={"center"}
               spacing={2}
               sx={{
                  bgcolor: "surface.4",
                  p: "10px 20px",
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
                     fontSize: 14,
                     padding: "0px",
                  }}
                  value={searchText}
                  onChange={(e) => {
                  setSearchText(e.target.value);
                  }}
               />
               <InputLabel htmlFor="exec">
                  <IconButton sx={{ border: "none", p: 0, ":hover": { color: "tertiary" } }}>
                     <SearchIcon />
                  </IconButton>
               </InputLabel>
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
            </Stack>
            )}
         </Box>
      </Box>
   )
}