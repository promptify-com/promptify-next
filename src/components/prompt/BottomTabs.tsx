import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

interface Props {
  setActiveTab: (tab: number) => void;
  activeTab: number;
}

const mobileTabs = [
  { name: "About", icon: <RemoveRedEyeOutlinedIcon /> },
  { name: "Create", icon: <ExitToAppIcon /> },
  { name: "Spark", icon: <MenuOutlinedIcon /> },
];

export const BottomTabs: React.FC<Props> = ({ setActiveTab, activeTab }) => {
  return (
    <Grid
      container
      sx={{
        display: { xs: "flex", md: "none" },
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 998,
        bgcolor: "surface.1",
        color: "onSurface",
        boxShadow:
          activeTab === 0
            ? "0px -8px 40px 0px rgba(93, 123, 186, 0.09), 0px -8px 10px 0px rgba(98, 98, 107, 0.03)"
            : "none",
        borderRadius: activeTab === 0 ? "16px 16px 0 0" : "0",
        p: "16px 24px",
        gap: 1,
        flexWrap: "nowrap",
      }}
    >
      {mobileTabs.map((tab, i) => (
        <Grid
          item
          xs={4}
          md={4}
          key={i}
          display="flex"
          justifyContent="center"
        >
          <Button
            startIcon={tab.icon}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: "42px",
              border: "none",
              borderRadius: 50,
              fontSize: 16,
              fontWeight: 500,
              bgcolor: activeTab === i ? "primary.main" : "transparent",
              color: activeTab === i ? "onPrimary" : "onSurface",
              svg: {
                width: 20,
                height: 20,
              },
              "&:hover, &:focus": {
                color: "onSurface",
                bgcolor: "surface.2",
              },
            }}
            onClick={() => {
              setActiveTab(i);
            }}
          >
            <Typography color="inherit">{tab.name}</Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default BottomTabs;
