import { ExpandLess, ExpandMore, MenuOpen } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useState } from "react";

function ExploreFilterSideBar() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <Drawer
      sx={{
        display: { xs: "none", md: "block" },
        width: "230px",
        marginLeft: "230px",
        "& .MuiDrawer-paper": {
          width: 230,
          marginLeft: "97px",
          boxSizing: "border-box",
          bgcolor: "surface.1",
          border: "1px",
        },
      }}
      anchor="left"
      variant="permanent"
    >
      <Box p={"18px 10px"}>
        <Grid
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          fontSize={24}
        >
          <Typography fontSize={19}>Explore</Typography>
          <IconButton
            sx={{
              border: "none",
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
            color="default"
          >
            <MenuOpen />
          </IconButton>
        </Grid>
        <List
          sx={{ width: "90%", bgcolor: "background.paper", mt: "6px" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton
            onClick={handleClick}
            selected
            sx={{ borderRadius: "8px" }}
          >
            <Avatar
              sx={{
                width: "28px",
                height: "28px",
                bgcolor: "black",
                mr: "8px",
              }}
            >
              {/* <LogoApp width={20} /> */}
            </Avatar>
            <ListItemText primary="All Category" />
            {open ? (
              <ExpandLess sx={{ color: grey[400] }} />
            ) : (
              <ExpandMore sx={{ color: grey[400] }} />
            )}
          </ListItemButton>
          <Collapse in={open} timeout={"auto"} unmountOnExit>

					</Collapse>
        </List>
      </Box>
    </Drawer>
  );
}

export default ExploreFilterSideBar;
