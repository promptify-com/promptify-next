import React from "react";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { LogoApp } from "@/assets/icons/LogoApp";
import Link from "next/link";
import { Home } from "@mui/icons-material";

interface Props {
  transparent?: boolean;
  fixed?: boolean;
  keyWord?: string;
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
  handleKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Sidebar: React.FC<Props> = () => {

  return (
    <Drawer
      sx={{
        width: 96,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 96,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box>
        <Link href="/">
          <LogoApp />
        </Link>
      </Box>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, i) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
