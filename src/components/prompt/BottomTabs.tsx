import React from "react";
import {
  Button,
  Grid,
  IconButton,
  Theme,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

interface Props {
  onChange: (tab: number) => void;
  setActiveTab: (tab: number) => void;
  activeTab: number;
}

const mobileTabs = [
  { name: "About", icon: <RemoveRedEyeOutlinedIcon /> },
  { name: "Ignite", icon: <ExitToAppIcon /> },
  { name: "Spark", icon: <MenuOutlinedIcon /> },
];

export const BottomTabs: React.FC<Props> = ({
  onChange,
  setActiveTab,
  activeTab,
}) => {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        bgcolor: "surface.1",
        color: "onSurface",
        boxShadow: "0px -8px 40px 0px rgba(93, 123, 186, 0.09), 0px -8px 10px 0px rgba(98, 98, 107, 0.03)",
        borderRadius: "24px 24px 0 0",
        p: "16px 24px",
        gap: 1,
        flexWrap: "nowrap"
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
              '&:hover, &:focus': {
                color: "onSurface",
                bgcolor: "surface.2"
              },
            }}
            onClick={() => {
              onChange(i);
              setActiveTab(i);
            }}
            >
            <Typography color="inherit">
              {tab.name}
            </Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default BottomTabs;
