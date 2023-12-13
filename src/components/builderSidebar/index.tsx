import { FC, ReactNode, useEffect, useState } from "react";
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
import { Close, FormatListBulleted } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import HelpIcon from "@/assets/icons/HelpIcon";
import { ApiIcon } from "@/assets/icons";
import PaperIcon from "@/assets/icons/PaperIcon";
import Help from "./Help";
import { useAppDispatch } from "@/hooks/useStore";
import { setOpenBuilderSidebar } from "@/core/store/sidebarSlice";
import PromptSequence from "./PromptSequence";
import { useRouter } from "next/router";

const drawerWidth = 352;

type LinkName = "list" | "paper" | "help" | "api";

interface Link {
  name: LinkName;
  icon: ReactNode;
}

export const BuilderSidebar: FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [activeLink, setActiveLink] = useState<LinkName>();
  const theme = useTheme();
  const Links: Link[] = [
    {
      name: "list",
      icon: <FormatListBulleted />,
    },
    {
      name: "paper",
      icon: <PaperIcon />,
    },
    {
      name: "help",
      icon: <HelpIcon />,
    },
    {
      name: "api",
      icon: <ApiIcon />,
    },
  ];
  const router = useRouter();

  useEffect(() => {
    if (router.query.slug === "create") {
      handleOpenSidebar("help");
    }
  }, []);

  const handleOpenSidebar = (link: LinkName) => {
    setOpen(true);
    setActiveLink(link);
    dispatch(setOpenBuilderSidebar(true));
  };

  const handleCloseSidebar = () => {
    setOpen(false);
    dispatch(setOpenBuilderSidebar(false));
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "64px",
        borderRadius: "var(--none, 0px)",
        borderLeft: "1px solid var(--divider, #E1E2EC)",
        bgcolor: "var(--dynamic-m-3-surfaces-surface-1, #FDFBFF)",
        padding: "75px var(--1, 8px)",
        zIndex: 1,
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
          marginRight: `${drawerWidth}px`,
        }),
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={1}
      >
        {Links.map(link => (
          <Grid key={link.name}>
            <ListItem
              disablePadding
              onClick={() => handleOpenSidebar(link.name)}
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
                    <Icon>{link.icon}</Icon>
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
              textTransform: "capitalize",
            }}
          >
            {activeLink === "list" ? "Prompt Sequence" : activeLink}
          </Typography>

          <IconButton
            onClick={() => handleCloseSidebar()}
            sx={{
              border: "none",
              "&:hover": {
                bgcolor: "surface.2",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider />
        {activeLink === "list" && <PromptSequence />}
        {activeLink === "help" && <Help />}
      </Drawer>
    </Box>
  );
};
