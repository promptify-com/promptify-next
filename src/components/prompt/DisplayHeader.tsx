import React, { useState } from 'react'
import { Box, Button, ClickAwayListener, Collapse, Grow, IconButton, InputBase, InputLabel, Paper, Popper, Stack, Typography, alpha, useTheme } from '@mui/material'
import { Search as SearchIcon, PushPinOutlined, FeedOutlined, ArrowDropUp, ArrowDropDown, Undo, Redo, PushPin, Close } from "@mui/icons-material";
import { SubjectIcon } from "@/assets/icons/SubjectIcon";
import { Spark, TemplatesExecutions } from '@/core/api/dto/templates';
import { SparksTabs } from './SparksTabs';

interface Props {
   sparks: Spark[];
   selectedSpark: Spark | null;
   changeSelectedSpark: (spark: Spark) => void;
   pinSpark: () => void;
}

export const DisplayHeader: React.FC<Props> = ({ 
   sparks,
   selectedSpark,
   changeSelectedSpark,
   pinSpark
 }) => {
   const  { palette } = useTheme();
   
   const [searchShown, setSearchShown] = useState(false);
   const [searchText, setSearchText] = useState("");
   const [presetsAnchor, setPresetsAnchor] = useState<HTMLElement | null>(null);

   const sortedSparks = [...sparks].sort((a, b) => {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
   });

   const SearchInput = (direction:"right"|"left") => (     
      <Stack direction={"row"} alignItems={"center"}>
         <Collapse orientation="horizontal" in={searchShown} 
            sx={{ order: direction === "right" ? 1 : 0 }}
         >
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
            {selectedSpark?.initial_title || "Choose Spark..."}
         </Box>
      </Button>
   )

   const PinButton = (
      <IconButton sx={{ ...iconButtonStyle, opacity: .5 }}
         onClick={pinSpark}
      >
         {selectedSpark?.is_favorite ? <PushPin /> : <PushPinOutlined />}
      </IconButton>
   )

   return (
      <Box sx={{ 
            position: "sticky", top: 0, left: 0, right: 0, zIndex: 998,
            p: { md: "16px 16px 16px 24px" }, 
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
               {PinButton}

               {SparksSelect}

               <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={1}
                  ml={"auto"}
               >
                  {SearchInput("left")}

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
            </Stack>

            {/* Small screen header */}
            <Box>
               <Stack
                  display={{ md: "none" }}
                  direction={"row"} alignItems={"center"} gap={1} p={"8px 16px"}
               >
                  {SparksSelect}

                  {PinButton}
               </Stack>
               <Stack
                  display={{ md: "none" }}
                  direction={"row"} alignItems={"center"} gap={1} p={"8px 16px"}
               >
                  {SearchInput("right")}

                  {false && (
                  <Button
                     sx={{ color: "onSurface", fontSize: 13, fontWeight: 500, ml: "auto" }}
                     startIcon={<FeedOutlined />}
                     endIcon={Boolean(presetsAnchor) ? <ArrowDropUp /> : <ArrowDropDown />}
                     variant={"text"}
                     onClick={(e) => setPresetsAnchor(e.currentTarget)}
                  >
                     Export
                  </Button> 
                  )}
               </Stack>
            </Box>

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
                              <SparksTabs 
                                 sparks={sortedSparks}
                                 chooseSpark={(spark) => {
                                    changeSelectedSpark(spark)
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