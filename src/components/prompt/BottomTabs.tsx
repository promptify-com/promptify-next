import React from 'react'
import { ArtTrack, History, Subject } from '@mui/icons-material'
import { Grid, IconButton } from '@mui/material'

interface Props {
   onChange: (tab: number) => void;
}

const mobileTabs = [
  { name: "details", icon: <ArtTrack /> },
  { name: "generator", icon: "(x)" },
  { name: "sparks", icon: <Subject /> },
  { name: "history", icon: <History /> },
]

export const BottomTabs: React.FC<Props> = ({ onChange }) => {

   const [activeTab, setActiveTab] = React.useState(0);

   return (
      <Grid container 
         sx={{ 
         display: { xs: "flex", md: "none" },
         position: "fixed",
         bottom: 0,
         left: 0,
         right: 0,
         zIndex: 999,
         bgcolor: "surface.1",
         }}
      >
         {mobileTabs.map((tab, i) => (
         <Grid item xs={3} md={4} key={i}>
            <IconButton
               onClick={() => { 
                  onChange(i)
                  setActiveTab(i)
               }}
               sx={{
                  width: "100%",
                  border: "none",
                  borderRadius: 0,
                  py: "24px",
                  fontSize: 16,
                  fontWeight: 500,
                  color: activeTab === i ? "primary.main" : "grey.600",
                  "&:hover, &:focus": {
                     color: "primary.main",
                  },
                  "svg": {
                     width: 20,
                     height: 20
                  },
               }}
            >
               {tab.icon}
            </IconButton>
         </Grid>
         ))}
      </Grid>
  )
}

export default BottomTabs