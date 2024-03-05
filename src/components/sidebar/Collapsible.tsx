import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CircleIcon from "@mui/icons-material/Circle";
import { Engine, Tag } from "@/core/api/dto/templates";
import { Typography } from "@mui/material";
export interface Item {
  name: string;
  id: string | number;
}

interface Props {
  title: string;
  items: Item[] | Engine[] | Tag[] | undefined;
}

function Collapsible({ title, items }: Props) {
  if (!items?.length || !title) return;

  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | number>("");
  const [showAll, setShowAll] = useState<boolean>(false);

  const onClickHandler = () => {
    setOpen(!open);
  };
  const handleListItemClick = (id: string | number) => {
    setSelectedItem(id);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedItems = showAll ? items : items.slice(0, 5);
  const isNotTags = title !== "Popular tags";
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "#EEEEE8",
        borderRadius: "16px",
        mb: "20px",
      }}
      component="nav"
    >
      <ListItemButton onClick={onClickHandler}>
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary={title} />
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
      >
        <List
          component="div"
          disablePadding
        >
          {displayedItems.map(item => (
            <ListItemButton
              key={item.name}
              selected={item.id === selectedItem}
              onClick={() => handleListItemClick(item.id)}
            >
              {isNotTags && (
                <Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CircleIcon />}
                  checked={item.id === selectedItem || false}
                  onClick={e => e.stopPropagation()}
                />
              )}
              <ListItemText primary={item.name} />
            </ListItemButton>
          ))}

          {items.length > 5 && !showAll && (
            <ListItemButton onClick={toggleShowAll}>
              <ListItemText
                primary="More..."
                style={{
                  marginLeft: "1.3em",
                }}
              />
            </ListItemButton>
          )}
        </List>
      </Collapse>
    </List>
  );
}

export default Collapsible;
