import { type Dispatch, type SetStateAction, ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Icon from "@mui/material/Icon";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Close from "@mui/icons-material/Close";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import { useTheme } from "@mui/material/styles";
import HelpIcon from "@/assets/icons/HelpIcon";
import { ApiIcon } from "@/assets/icons";
import Help from "./Help";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setOpenBuilderSidebar } from "@/core/store/sidebarSlice";
import PromptSequence from "./PromptSequence";
import type { IEditPrompts } from "@/common/types/builder";
import PaperIcon from "@/assets/icons/PaperIcon";
import TestLog from "./TestLog";

type LinkName = "list" | "test_log" | "help" | "api";

interface Link {
  key: LinkName;
  name: string;
  icon: ReactNode;
}

interface Props {
  prompts: IEditPrompts[];
  setPrompts: Dispatch<SetStateAction<IEditPrompts[]>>;
}

export const BuilderSidebar = ({ prompts, setPrompts }: Props) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const engines = useAppSelector(state => state.builder.engines);

  const [activeLink, setActiveLink] = useState<Link>();

  const theme = useTheme();

  const Links: Link[] = [
    {
      key: "list",
      name: "Prompt sequence",
      icon: <FormatListBulleted />,
    },
    {
      key: "test_log",
      name: "Test log",
      icon: <PaperIcon />,
    },
    {
      key: "help",
      name: "Help",
      icon: <HelpIcon />,
    },
    {
      key: "api",
      name: "Api",
      icon: <ApiIcon />,
    },
  ];

  const handleOpenSidebar = (link: Link) => {
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
          marginRight: theme.custom.promptBuilder.drawerWidth,
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
              onClick={() => handleOpenSidebar(link)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  borderRadius: "8px",
                  mx: 1,
                  padding: "16px 22px ",
                  bgcolor: open && activeLink?.name === link.name ? "action.hover" : "transparent",
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
          width: theme.custom.promptBuilder.drawerWidth,
          flexShrink: 0,
          mt: theme.custom.promptBuilder.headerHeight,
          "& .MuiDrawer-paper": {
            width: theme.custom.promptBuilder.drawerWidth,
            bgcolor: "surface.1",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box
          display="flex"
          alignItems="center"
          p={"16px 24px"}
          justifyContent="space-between"
          border={`1px solid ${theme.palette.surface[3]}`}
          height="70px"
          boxSizing={"border-box"}
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
            {activeLink?.name}
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
        {activeLink?.key === "list" && (
          <PromptSequence
            prompts={prompts}
            engines={engines}
            setPrompts={setPrompts}
          />
        )}
        {activeLink?.key === "help" && <Help />}
        {activeLink?.key === "test_log" && <TestLog />}
      </Drawer>
    </Box>
  );
};
