import {
  Box,
  Divider,
  Drawer,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import HelpIcon from "@/assets/icons/HelpIcon";

interface SideBarRightProps {
  open: boolean;
  toggleSideBarRight: () => void;
  closeSideBarRight: () => void;
}

const drawerWidth = 352;

export const SidebarRight: React.FC<SideBarRightProps> = ({ open, toggleSideBarRight, closeSideBarRight }) => {
  const theme = useTheme();

  const navItems = [
    {
      name: "help",
      icon: <HelpIcon />,
      external: false,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        right: 0,
        height: "100vh",
        width: "64px",
        borderRadius: "var(--none, 0px)",
        borderLeft: "1px solid var(--divider, #E1E2EC)",
        bgcolor: "var(--dynamic-m-3-surfaces-surface-1, #FDFBFF)",
        padding: "var(--2, 16px) var(--1, 8px)",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--3, 24px)",
        alignSelf: "stretch",
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: "auto",
        ...(open && {
          width: "64px",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginRight: `calc(64px + ${drawerWidth - 64}px)`,
        }),
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={1}
      >
        {navItems.map(item => (
          <Grid key={item.name}>
            <ListItem
              disablePadding
              onClick={toggleSideBarRight}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  borderRadius: "8px",
                  mx: 1,
                  padding: "16px 22px ",
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
                      color: "onSurface",
                      justifyContent: "center",
                    }}
                  >
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                </Box>
              </ListItemButton>
            </ListItem>
          </Grid>
        ))}
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxShadow: "3px 0px 10px rgba(0, 0, 0, 0.2)",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box
          bgcolor={"surface.1"}
          display="flex"
          alignItems="center"
          p={"16px 24px"}
          justifyContent="space-between"
          border={`1px solid ${theme.palette.surface[3]}`}
        >
          <Typography
            variant="h6"
            sx={{
              color: "var(--onSurface, #1B1B1E)",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "140%",
              letterSpacing: "0.5px",
            }}
          >
            Help
          </Typography>

          <IconButton
            onClick={closeSideBarRight}
            sx={{ marginLeft: "auto" }}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "#000",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "34px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "120%",
              p: "1em",
            }}
          >
            Get Started
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};
