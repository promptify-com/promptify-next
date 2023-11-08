import { FC, ReactNode, useState } from "react";
import { Box, Drawer, Grid, Icon, IconButton, ListItem, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import { Api, ChatBubbleOutline, Close, InfoOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch } from "@/hooks/useStore";
import { setOpenBuilderSidebar } from "@/core/store/sidebarSlice";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import ExtensionSettingsIcon from "@/assets/icons/ExtensionSettingsIcon";

const drawerWidth = 352;

type LinkName = "executions" | "feedback" | "api" | "extension" | "details";

interface Link {
  name: LinkName;
  icon: ReactNode;
  title: string;
}

export const Sidebar: FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const [activeLink, setActiveLink] = useState<Link>();

  const theme = useTheme();

  const Links: Link[] = [
    {
      name: "executions",
      icon: <NoteStackIcon />,
      title: "My Works",
    },
    {
      name: "feedback",
      icon: <ChatBubbleOutline />,
      title: "Feedback",
    },
    {
      name: "api",
      icon: <Api />,
      title: "API access",
    },
    {
      name: "extension",
      icon: <ExtensionSettingsIcon />,
      title: "Extension settings",
    },
    {
      name: "details",
      icon: <InfoOutlined />,
      title: "Template details",
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
        bgcolor: "surface.1",
        display: "flex",
        height: "100%",
        position: "sticky",
        top: 0,
      }}
    >
      <Drawer
        sx={{
          width: open ? drawerWidth : 0,
          position: "relative",
          "& .MuiDrawer-paper": {
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            bgcolor: "surface.1",
            borderLeft: `1px solid ${theme.palette.surface[3]}`,
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
        >
          <Typography
            sx={{
              color: "common.black",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {activeLink?.title}
          </Typography>

          <IconButton
            onClick={handleCloseSidebar}
            sx={{
              border: "none",
              opacity: 0.45,
              "&:hover": {
                bgcolor: "surface.2",
                opacity: 1,
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        {/* {activeLink === "executions" && <PromptSequence />}
        {activeLink === "help" && <Help />} */}
      </Drawer>
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={1}
        sx={{
          p: "16px",
          zIndex: 1300,
          bgcolor: "surface.1",
          borderLeft: `1px solid ${theme.palette.surface[3]}`,
        }}
      >
        {Links.map(link => (
          <Grid key={link.name}>
            <ListItem
              disablePadding
              onClick={() => handleOpenSidebar(link)}
            >
              <ListItemButton
                sx={{
                  borderRadius: "16px",
                  padding: "12px",
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
    </Box>
  );
};
