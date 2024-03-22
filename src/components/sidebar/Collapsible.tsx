import { ReactNode, useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

export interface Item {
  name: string;
  id: number;
  icon?: ReactNode;
  type?: string;
}

interface Props {
  title: string;
  items: Item[];
  onSelect: (item: Item) => void;
  isSelected: (item: Item) => boolean;
}

function Collapsible({ title, items, onSelect, isSelected }: Props) {
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
    <List sx={{ borderRadius: "16px", overflow: "hidden", p: 0 }}>
      <ListItemButton
        onClick={onClickHandler}
        sx={{ p: "16px 8px", fontSize: 14, fontWeight: 500, color: "onSurface", justifyContent: "space-between" }}
      >
        {title}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
      >
        <List
          component="div"
          sx={{
            p: "4px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {displayedItems.map(item => (
            <ListItemButton
              key={item.name}
              selected={isSelected(item)}
              onClick={() => onSelect(item)}
              sx={{
                p: "12px 16px",
                borderRadius: "8px",
                bgcolor: "surfaceContainer",
                color: "onSurface",
                fontSize: 16,
                fontWeight: 500,
                gap: 2,
                svg: { fontSize: 16 },
              }}
            >
              {item.icon}
              {item.name}
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
