import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ToolbarItem from "./ToolbarItem";
import Close from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "../FavoriteIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItem from "@mui/material/ListItem";

import { useTheme } from "@mui/material/styles/";
import { useAppDispatch } from "@/hooks/useStore";
import { setOpenBuilderSidebar } from "@/core/store/sidebarSlice";
import type { Link } from "@/common/types/TemplateToolbar";
import { ToolbarItems } from "@/common/constants";
import { Templates } from "@/core/api/dto/templates";
import { Executions } from "./Executions";
import { TemplateDetails } from "./TemplateDetails";
import { ApiAccess } from "./ApiAccess";
import { Extension } from "./Extension";
import { Feedback } from "./Feedback";

const drawerWidth = 352;

interface Props {
  template: Templates;
}

function TemplateToolbar({ template }: Props) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const [activeLink, setActiveLink] = useState<Link>();

  const theme = useTheme();

  const handleOpenSidebar = (link: Link) => {
    setOpen(true);
    setActiveLink(link);
    dispatch(setOpenBuilderSidebar(true));
  };

  const handleCloseSidebar = () => {
    setOpen(false);
    dispatch(setOpenBuilderSidebar(false));
  };

  const handleItemClick = (link: Link) => {
    if (link.name === "customize") {
      const url = `/prompt-builder/${template.slug}?editor=1`;
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "surface.1",
          display: "flex",
          height: "100%",
          position: "sticky",
          top: 0,
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          sx={{
            p: "16px",
            zIndex: 1300,
            bgcolor: "surface.1",
            borderLeft: `1px solid ${theme.palette.surface[3]}`,
          }}
        >
          <Avatar
            src={template.created_by.avatar}
            alt={template.created_by.username}
            sx={{ width: 30, height: 30 }}
          />

          <ListItem
            disablePadding
            sx={{
              mb: -2,
            }}
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
                    color: "onSurface",
                    justifyContent: "center",
                  }}
                >
                  <FavoriteIcon
                    style={{
                      sx: {
                        flexDirection: "column",
                        p: 0,
                        color: "secondary.main",
                        fontSize: 13,
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemIcon>
              </Box>
            </ListItemButton>
          </ListItem>

          {ToolbarItems.map(link => (
            <ToolbarItem
              selected={activeLink?.name}
              key={link.title}
              item={link}
              onOpen={handleOpenSidebar}
              onClick={handleItemClick}
            />
          ))}
        </Box>
      </Box>
      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
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
        {activeLink?.name === "executions" && <Executions template={template} />}
        {activeLink?.name === "feedback" && <Feedback />}
        {activeLink?.name === "api" && <ApiAccess template={template} />}
        {activeLink?.name === "extension" && <Extension />}
        {activeLink?.name === "details" && <TemplateDetails template={template} />}
      </Drawer>
    </>
  );
}

export default TemplateToolbar;
