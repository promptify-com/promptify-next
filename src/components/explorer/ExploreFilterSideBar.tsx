import { Engine, Tag } from "@/core/api/dto/templates";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  List,
  ListItemButton,
  ListSubheader,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface Props {
  engines: Engine[];
  tags: Tag[];
}

export const ExploreFilterSideBar: React.FC<Props> = ({ engines, tags }) => {
  const [itemsToShow, setItemsToShow] = useState<number>(3);

  const showmore = () => {
    setItemsToShow(engines.length);
  };

  const showless = () => {
    setItemsToShow(3);
  };
  return (
    <Box>
      <List
        subheader={
          <ListSubheader sx={{ fontSize: "12px" }}>ENGINES</ListSubheader>
        }
      >
        {engines?.slice(0, itemsToShow).map((engine) => (
          <ListItemButton
            key={engine.id}
            sx={{ borderRadius: "8px" }}
            aria-label="sss"
          >
            <Avatar
              alt={engine.name}
              src={engine.name}
              sx={{
                width: "28px",
                height: "28px",
                mr: "5px",
              }}
            />
            <Typography fontSize={12}>{engine.name}</Typography>
          </ListItemButton>
        ))}
        <Button
          sx={{
            fontSize: "12px",
            color: "black",
          }}
          variant="text"
          onClick={itemsToShow === 3 ? showmore : showless}
        >
          {itemsToShow === 3 ? "See all" : "Show less"}
        </Button>
      </List>
      <List
        subheader={
          <ListSubheader sx={{ fontSize: "12px" }}>POPULAR TAGS</ListSubheader>
        }
      >
        <Grid
          display={"flex"}
          direction={"column"}
          alignItems={"start"}
          gap={1}
          ml={"14px"}
        >
          {tags.map((tag) => (
            <Chip
              sx={{
                color: "black",
                fontWeight: 500,
              }}
              size="small"
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
