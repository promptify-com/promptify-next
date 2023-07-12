import { Category, Engine, Tag } from "@/core/api/dto/templates";
import { ExpandLess, ExpandMore, MenuOpen } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
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
import { boolean } from "yup";

interface Props {
  categories: Category[];
  engines: Engine[];
  tags: Tag[];
}

export const ExploreFilterSideBar: React.FC<Props> = ({
  categories,
  engines,
  tags,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [itemsToShow, setItemsToShow] = useState<number>(3);

  const handleClick = () => {
    setOpen(!open);
  };

  const showmore = () => {
    setItemsToShow(engines.length);
  };

  const showless = () => {
    setItemsToShow(3);
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
          sx={{ width: "100%", bgcolor: "background.paper", mt: "6px" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton
            onClick={handleClick}
            selected
            sx={{ borderRadius: "8px" }}
          >
            <Avatar
              alt="All category"
              src="All category"
              sx={{
                width: "28px",
                height: "28px",
                bgcolor: "black",
                mr: "8px",
              }}
            ></Avatar>
            <ListItemText primary="All Category" />
            {open ? (
              <ExpandLess sx={{ color: grey[400] }} />
            ) : (
              <ExpandMore sx={{ color: grey[400] }} />
            )}
          </ListItemButton>
          <Collapse in={open} timeout={100}>
            {categories
              ?.filter((mainCat) => !mainCat.parent)
              .map((category) => (
                <ListItemButton key={category.id} sx={{ borderRadius: "8px" }}>
                  <Avatar
                    alt={category.name}
                    src={category.name}
                    sx={{
                      width: "28px",
                      height: "28px",
                      mr: "5px",
                    }}
                  />
                  <Typography fontSize={12}>{category.name}</Typography>
                </ListItemButton>
              ))}
          </Collapse>
        </List>
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
            <ListSubheader sx={{ fontSize: "12px" }}>
              POPULAR TAGS
            </ListSubheader>
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
    </Drawer>
  );
};
