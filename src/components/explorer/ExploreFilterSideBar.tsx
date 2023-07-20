import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Typography,
} from "@mui/material";

import { Engine, Tag } from "@/core/api/dto/templates";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedEngine } from "@/core/store/enginesSlice";
import { RootState } from "@/core/store";
import { Clear } from "@mui/icons-material";

interface ExploreFilterSideBarProps {
  sidebarOpen: boolean;
  engines: Engine[] | undefined;
  tags: Tag[] | undefined;
}

export const ExploreFilterSideBar: React.FC<ExploreFilterSideBarProps> = ({
  engines,
  tags,
  sidebarOpen,
}) => {
  const [itemsToShow, setItemsToShow] = useState<number>(3);

  const selectedEngineId = useSelector(
    (state: RootState) => state.engines.engine
  );
  const dispatch = useDispatch();

  const handleEngineSelect = (engine: number | null) => {
    dispatch(setSelectedEngine(engine));
  };

  const showmore = () => {
    if (engines?.length) {
      setItemsToShow(engines.length);
    }
  };

  const showless = () => {
    setItemsToShow(3);
  };
  return (
    <Box sx={{ opacity: sidebarOpen ? 1 : 0 }}>
      <List
        subheader={
          <ListSubheader sx={{ fontSize: "12px", ml: "17px" }}>
            ENGINES
          </ListSubheader>
        }
      >
        <Grid
          className="sidebar-list"
          sx={{
            height: itemsToShow === 3 ? "auto" : "400px",
            overflowY: itemsToShow === 3 ? "none" : "scroll",
            overflowX: "none",
          }}
        >
          {engines?.slice(0, itemsToShow).map((engine) => (
            <ListItem
              disablePadding
              key={engine.name}
              sx={{ position: "relative" }}
            >
              <ListItemButton
                key={engine.id}
                sx={{ borderRadius: "8px", minHeight: 48, pl: -4 }}
                onClick={() => handleEngineSelect(engine.id)}
                selected={selectedEngineId == engine.id}
              >
                <Avatar
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS58O0-OcWTqwlFJCYTkJUSVlGeqleLPstyYdxFFcXNpQ&s"
                  }
                  alt={engine.name}
                  sx={{
                    width: "30px",
                    height: "30px",
                    mr: "18px",
                  }}
                />
                <Typography fontSize={14} fontWeight={500} color={"onSurface"}>
                  {engine.name}
                </Typography>
              </ListItemButton>
              {selectedEngineId == engine.id && (
                <IconButton
                  onClick={() => handleEngineSelect(null)}
                  size="small"
                  sx={{
                    mr: -3,
                    width: "23px",
                    border: "none",
                    bgcolor: "onSurface",
                    height: "23px",
                    color: "white",
                  }}
                >
                  <Clear />
                </IconButton>
              )}
            </ListItem>
          ))}
        </Grid>
        <Button
          sx={{
            fontSize: "12px",
            color: "black",
            mx: 2,
          }}
          variant="text"
          onClick={itemsToShow === 3 ? showmore : showless}
        >
          {itemsToShow === 3 ? "See all" : "Show less"}
        </Button>
      </List>
      <List
        subheader={
          <ListSubheader sx={{ fontSize: "12px", ml: "17px" }}>
            POPULAR TAGS
          </ListSubheader>
        }
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
          gap={"8px"}
          ml={"29px"}
        >
          {tags?.map((tag) => (
            <Chip
              sx={{
                bgcolor: "surface.3",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                height: "24px",
              }}
              key={tag.id}
              label={tag.name}
              onClick={() => {}}
            />
          ))}
        </Grid>
      </List>
    </Box>
  );
};
