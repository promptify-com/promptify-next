import { useState } from "react";
import {
  Badge,
  Box,
  Drawer,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import { Api, ChatBubbleOutline, Close, InfoOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAppSelector } from "@/hooks/useStore";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import ExtensionSettingsIcon from "@/assets/icons/ExtensionSettingsIcon";
import { Templates } from "@/core/api/dto/templates";
import { Executions } from "./Executions";
import { TemplateDetails } from "./TemplateDetails";
import { ApiAccess } from "./ApiAccess";
import { Extension } from "./Extension";
import { Feedback } from "./Feedback";
import { isValidUserFn } from "@/core/store/userSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import { SidebarLink } from "@/common/types/template";
import { useDispatch } from "react-redux";
import { setActiveSidebarLink } from "@/core/store/templatesSlice";
import { isDesktopViewPort } from "@/common/helpers";

const drawerWidth = 352;

interface SidebarProps {
  template: Templates;
}

export const Sidebar: React.FC<SidebarProps> = ({ template }) => {
  const activeLink = useAppSelector(state => state.template.activeSideBarLink);
  const isMobile = !isDesktopViewPort();
  const isValidUser = useAppSelector(isValidUserFn);
  const {
    data: executions,
    isLoading: isExecutionsLoading,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

  const dispatch = useDispatch();
  const theme = useTheme();

  const Links: SidebarLink[] = [
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
      icon: <Api sx={{ color: "primary.main" }} />,
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

  const handleOpenSidebar = (link: SidebarLink) => {
    dispatch(setActiveSidebarLink(link));
  };

  const handleCloseSidebar = () => {
    console.log("cloe");
    dispatch(setActiveSidebarLink(null));
  };

  const open = !!activeLink?.name;

  return (
    <Box
      sx={{
        width: open ? { xs: "100%", md: drawerWidth } : 0,
        height: "100%",
        bgcolor: "surface.1",
        display: "flex",
        position: { xs: "absolute", md: "sticky" },
        top: 0,
      }}
    >
      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        sx={{
          width: "100%",
          transition: theme.transitions.create("width", { duration: 200 }),
          position: "relative",
          "& .MuiDrawer-paper": {
            display: open ? "flex" : "none",
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            bgcolor: "surface.1",
            borderLeft: `1px solid ${theme.palette.surface[3]}`,
          },
        }}
      >
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            bgcolor: "surface.1",
            p: "16px 24px",
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 1300,
          }}
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
        </Stack>
        {activeLink?.name === "executions" && (
          <Executions
            template={template}
            executions={executions}
            isExecutionsLoading={isExecutionsLoading}
            refetchTemplateExecutions={refetchTemplateExecutions}
            onSelectExecution={() => (isMobile ? handleCloseSidebar() : null)}
          />
        )}
        {activeLink?.name === "feedback" && <Feedback />}
        {activeLink?.name === "api" && <ApiAccess template={template} />}
        {activeLink?.name === "extension" && <Extension />}
        {activeLink?.name === "details" && <TemplateDetails template={template} />}
      </Drawer>
      <Stack
        display={{ xs: "none", md: "flex" }}
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
                      position: "relative",
                    }}
                  >
                    {link.name === "executions" && executions?.length ? (
                      <Badge
                        badgeContent={executions.length}
                        sx={{
                          ".MuiBadge-badge.MuiBadge-standard": {
                            bgcolor: "surface.1",
                            fontSize: 10,
                            fontWeight: 500,
                            border: "1px solid",
                            borderColor: "divider",
                            height: 20,
                            minWidth: 20,
                            p: "0 3px",
                          },
                        }}
                      >
                        <Icon>{link.icon}</Icon>
                      </Badge>
                    ) : (
                      <Icon>{link.icon}</Icon>
                    )}
                  </ListItemIcon>
                </Box>
              </ListItemButton>
            </ListItem>
          </Grid>
        ))}
      </Stack>
    </Box>
  );
};
