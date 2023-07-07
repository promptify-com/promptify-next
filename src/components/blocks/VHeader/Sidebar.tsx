import React from "react";
import {
  Box,
  Drawer,
  Icon,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { LogoApp } from "@/assets/icons/LogoApp";
import Link from "next/link";
import { AutoStoriesOutlined, BookmarkAddOutlined, HomeOutlined, Search, Support } from "@mui/icons-material";

const navItems = [
  { name: "Home", href: "/", icon: <HomeOutlined /> },
  { name: "Explore", href: "/", icon: <Search /> },
  { name: "Learn", href: "/", icon: <AutoStoriesOutlined /> },
  { name: "Favorites", href: "/", icon: <BookmarkAddOutlined /> },
  { name: "Help", href: "/", icon: <Support /> },
];

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
        display: { xs: "none", md: "block" },
        width: "96px",
        '& .MuiDrawer-paper': {
          width: 96,
          boxSizing: 'border-box',
          bgcolor: 'surface.1',
          border: 'none'
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Stack height={'100%'} gap={1}>
        <Box sx={{ p: '24px', textAlign: 'center' }}>
          <Link href="/">
            <LogoApp width={30} />
          </Link>
        </Box>
        {navItems.map((item, i) => (
          <ListItem key={i}
            sx={{ 
              p: 0, 
              mt: (i === navItems.length - 1) ? 'auto' : 0 
            }}
          >
            <ListItemButton sx={{ p: '8px' }}>
              <Link href={item.href} style={{ textDecoration: "none", width: '100%' }}>
                <Stack sx={{ flex: 1, alignItems: 'center', textAlign: 'center', color: 'onSurface' }}>
                  <Icon sx={{ p: '12px' }}>{item.icon}</Icon>
                  <Typography fontSize={12} fontWeight={400} color={'onSurface'}>{item.name}</Typography>
                </Stack>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </Stack>
    </Drawer>
  );
};
