import React from "react";
import {
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
        bottom: 10,
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        zIndex: 999,
        bgcolor: alpha(theme.palette.primary.main, 0.9),
        width: "90%",
        borderRadius: "50px",
      }}
    >
      {mobileTabs.map((tab, i) => (
        <Grid
          item
          xs={4}
          md={4}
          key={i}
          py="10px"
          display="flex"
          justifyContent="center"
        >
          <IconButton
            onClick={() => {
              onChange(i);
              setActiveTab(i);
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "80%",
              height: "42px",
              border: "none",
              borderRadius: 50,
              fontSize: 16,
              fontWeight: 500,
              bgcolor: activeTab === i ? "#FFF" : "transparent",
              color: activeTab === i ? "#000" : "#FFF",
              svg: {
                width: 20,
                height: 20,
              },
              '&:hover, &:focus': {
                color: "#000",
                bgcolor: "#FFF"
              },
            }}
          >
            {tab.icon}
            <Typography
              ml="10px"
              sx={{ color: activeTab === i ? "#000" : "#FFF" }}
            >
              {tab.name}
            </Typography>
          </IconButton>
        </Grid>
      ))}
    </Grid>
  );
};

export default BottomTabs;
