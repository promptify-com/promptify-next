import React, { useState } from 'react'
import { Box, Button, IconButton, InputBase, InputLabel, Stack } from '@mui/material'
import { Search as SearchIcon, Close } from "@mui/icons-material";
import { SubjectIcon } from "@/assets/icons/SubjectIcon";

export const ExecutionsHeader = () => {
   const [searchShown, setSearchShown] = useState(false);
   const [searchText, setSearchText] = useState("");

   return (
      <Box>
         <Box sx={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 998 }}>
         {searchShown && (
            <Stack
               direction={"row"}
               alignItems={"center"}
               spacing={1}
               sx={{
                  display: { md: "none" },
                  bgcolor: "surface.1",
                  color: "onSurface",
                  py: "10px",
               }}
            >
               <Box
               sx={{
                  flex: 1,
               }}
               >
               <Stack
                  direction={"row"}
                  alignItems={"center"}
                  spacing={2}
                  sx={{
                     flex: 1,
                     bgcolor: "surface.4",
                     p: "8px 8px 8px 16px",
                     borderRadius: "99px",
                  }}
               >
                  <SearchIcon />
                  <InputBase
                     id="exec"
                     placeholder={"Search..."}
                     fullWidth
                     sx={{
                        flex: 1,
                        fontSize: 14,
                        pr: "5px",
                     }}
                     value={searchText}
                     onChange={(e) => {
                     setSearchText(e.target.value);
                     }}
                  />
               </Stack>
               </Box>
               <IconButton
                  sx={{
                     border: "none",
                     bgcolor: "surface.1",
                     ":hover": { color: "tertiary" },
                  }}
                  onClick={() => setSearchShown(!searchShown)}
               >
               <Close />
               </IconButton>
            </Stack>
         )}

         <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            sx={{
               display: { xs: "none", md: "flex" },
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
               <IconButton
               sx={{ border: "none", p: 0, ":hover": { color: "tertiary" } }}
               >
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
         </Box>
      </Box>
   )
}