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
export interface Item {
  name: string;
  id: number;
  type?: string;
}

interface Props {
  title: string;
  items: Item[] | Engine[] | Tag[] | undefined;
  onSelect: (item: Item) => void;
  isSelected: (item: Item) => boolean;
  isTags?: boolean;
}

function Collapsible({ title, items, onSelect, isSelected, isTags }: Props) {
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState<boolean>(false);

  const onClickHandler = () => {
    setOpen(!open);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (!items?.length || !title) return;

  const displayedItems = showAll ? items : items.slice(0, 5);

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "surfaceContainerHigh",
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
              selected={isSelected(item)}
              onClick={() => onSelect(item)}
            >
              {!isTags && (
                <Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CircleIcon />}
                  checked={isSelected(item)}
                  onClick={e => {
                    e.stopPropagation();
                    onSelect(item);
                  }}
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
