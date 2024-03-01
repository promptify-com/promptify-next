import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

export interface Item {
  name: string;
  value: string | number;
}

interface Props {
  title: string;
  items: Item[];
}

function Collapsible({ title, items }: Props) {
  if (!items?.length || !title) return;

  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | number>("");
  const onClickHandler = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 300, bgcolor: "#EEEEE8", borderRadius: "8px", mb: "20px" }}
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
          {items.map(item => (
            <ListItemButton
              key={item.name}
              selected={item.value === selectedItem}
              onClick={() => setSelectedItem(item.value)}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </List>
  );
}

export default Collapsible;
