import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Typography,
} from "@mui/material";
import { Engine, Tag } from "@/core/api/dto/templates";
import { useDispatch, useSelector } from "react-redux";
import { deleteSelectedTag, setSelectedEngine, setSelectedTag } from "@/core/store/filtersSlice";
import { RootState } from "@/core/store";

interface ExploreFilterSideBarProps {
  sidebarOpen: boolean;
  engines: Engine[] | undefined;
  tags: Tag[] | undefined;
}

const listHeaderStyle = { fontSize: "12px", m: "0 5px", borderRadius: "16px", textAlign: "center" };
export const ExploreFilterSideBar: React.FC<ExploreFilterSideBarProps> = ({ engines, tags, sidebarOpen }) => {
  const [itemsToShow, setItemsToShow] = useState<number>(3);
  const filters = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch();
  const handleEngineSelect = (engine: Engine | null) => {
    dispatch(setSelectedEngine(engine));
  };
  const handleTagSelect = (tag: Tag) => {
    if (storedTags.includes(tag)) {
      dispatch(deleteSelectedTag(tag.id));
    } else {
      dispatch(setSelectedTag(tag));
    }
  };
  const showmore = () => {
    if (engines?.length) {
      setItemsToShow(engines.length);
    }
  };
  const { engine: storedEngine, tag: storedTags } = filters;
  const showless = () => {
    setItemsToShow(3);
  };

  return (
    <Box sx={{ opacity: sidebarOpen ? 1 : 0, width: "96%", margin: "0 auto" }}>
      <List subheader={<ListSubheader sx={listHeaderStyle}>ENGINES</ListSubheader>}>
        <Grid
          className="sidebar-list"
          sx={{
            height: itemsToShow === 3 ? "auto" : "400px",
            overflowY: itemsToShow === 3 ? "none" : "scroll",
            overflowX: "none",
          }}
        >
          {engines?.slice(0, itemsToShow).map(engine => (
            <ListItem
              disablePadding
              key={engine.name}
            >
              <ListItemButton
                sx={{ borderRadius: "8px", minHeight: 48, px: 2.5 }}
                onClick={() => handleEngineSelect(engine)}
                selected={storedEngine?.id == engine.id}
              >
                <Avatar
                  src={require("@/assets/images/promptify.png")}
                  alt={engine.name}
                  sx={{
                    width: "25px",
                    height: "25px",
                    mr: "8px",
                  }}
                />
                <Typography
                  fontSize={13}
                  fontWeight={500}
                  color={"onSurface"}
                >
                  {engine.name}
                </Typography>
              </ListItemButton>
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
      <List subheader={<ListSubheader sx={{ ...listHeaderStyle, mb: "10px" }}>POPULAR TAGS</ListSubheader>}>
        <Grid
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
          gap={"8px"}
          ml={"20px"}
        >
          {tags?.map(tag => (
            <Chip
              sx={{
                bgcolor: storedTags.includes(tag) ? "#9DB2BF" : "surface.5",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                height: "24px",
              }}
              key={tag.id}
              label={tag.name}
              onClick={() => handleTagSelect(tag)}
            />
          ))}
        </Grid>
      </List>
    </Box>
  );
};
