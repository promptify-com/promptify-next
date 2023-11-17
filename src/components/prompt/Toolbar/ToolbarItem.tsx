import ExtensionSettingsIcon from "@/assets/icons/ExtensionSettingsIcon";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import type { Link, LinkName } from "@/common/types/TemplateToolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import React from "react";

interface Props {
  item: Link;
  onOpen: (item: Link) => void;
  onClick: (item: Link) => void;
  selected?: LinkName;
}

function ToolbarItem({ item, onClick, onOpen, selected }: Props) {
  const handleClick = (link: Link) => {
    if (link.name === "customize") {
      onClick(link);
    } else {
      onOpen(link);
    }
  };

  const isSelected = selected === item.name;

  const renderIcon = () => {
    const iconColor = isSelected ? "#375CA9" : "#1B1B1E";

    switch (item.name) {
      case "extension":
        return <ExtensionSettingsIcon color={iconColor} />;
      case "executions":
        return <NoteStackIcon color={iconColor} />;
      default:
        return item.icon;
    }
  };
  return (
    <Grid key={item.name}>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleClick(item)}
          disabled={item.name === "feedback"}
          sx={{
            borderRadius: "16px",
            padding: "12px",
            backgroundColor: isSelected ? "#375CA91A" : undefined, // Conditional background color
          }}
        >
          <Box
            style={{
              textDecoration: "none",
              display: "flex",
              width: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: "auto",
                color: isSelected || item.name === "api" ? "#375CA9" : "onSurface",
                justifyContent: "center",
              }}
            >
              <Icon>{renderIcon()}</Icon>
            </ListItemIcon>
          </Box>
        </ListItemButton>
      </ListItem>
    </Grid>
  );
}

export default ToolbarItem;
