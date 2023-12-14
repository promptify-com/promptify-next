import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppSelector } from "@/hooks/useStore";
import { useRouter } from "next/router";
import Close from "@mui/icons-material/Close";

import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { Executions } from "./Executions";
import { TemplateDetails } from "./TemplateDetails";
import { ApiAccess } from "./ApiAccess";
import { Extension } from "./Extension";
import { Feedback } from "./Feedback";
import { isValidUserFn } from "@/core/store/userSlice";

import { useDispatch } from "react-redux";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import ToolbarItem from "../../Common/Sidebar/ToolbarItem";
import { TemplateSidebarLinks } from "@/common/constants";
import FavoriteIcon from "../FavoriteIcon";

const drawerWidth = 352;

interface SidebarProps {
  template: Templates;
  executions: TemplatesExecutions[];
  isLoading: boolean;
  refetchExecutions: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ template, executions, isLoading, refetchExecutions }) => {
  const activeLink = useAppSelector(state => state.template.activeSideBarLink);
  const isValidUser = useAppSelector(isValidUserFn);

  const router = useRouter();
  const activeVariant = router.query.variant;

  const dispatch = useDispatch();
  const theme = useTheme();

  const handleCloseSidebar = () => {
    dispatch(setActiveToolbarLink(null));
  };

  const open = !!activeLink?.name;

  const isVariantA = activeVariant === "a";

  const shouldFilterCustomize = isVariantA || (!isVariantA && !isValidUser);

  const filtredSidebarLinks = shouldFilterCustomize
    ? TemplateSidebarLinks.filter(item => item.name !== "customize")
    : TemplateSidebarLinks;
  return (
    <Box
      sx={{
        width: { xs: open ? "100%" : 0, md: "auto" },
        height: "100%",
        position: { xs: "absolute", md: "sticky" },
        top: 0,
        bgcolor: "surface.3",
        display: "flex",
        flexDirection: !isVariantA ? "row" : "row-reverse",
        gap: "1px",
      }}
    >
      {!isVariantA ? (
        <Box
          sx={{
            display: "flex",
            height: "100%",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            sx={{
              p: "16px",
              zIndex: 1300,
              bgcolor: "surface.1",
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

            {filtredSidebarLinks.map(link => (
              <ToolbarItem
                activeVariant={activeVariant as string}
                key={link.title}
                item={link}
                template={template}
                executionsLength={executions?.length ?? 0}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <Stack
          display={{ xs: "none", md: "flex" }}
          gap={1}
          sx={{
            p: "16px",
            zIndex: 1300,
            bgcolor: "surface.1",
          }}
        >
          {filtredSidebarLinks.map(link => (
            <ToolbarItem
              activeVariant={activeVariant as string}
              key={link.title}
              item={link}
              template={template}
              executionsLength={executions?.length ?? 0}
            />
          ))}
        </Stack>
      )}

      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        sx={{
          width: { xs: "100%", md: open ? drawerWidth : 0 },
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
            border: "none",
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
            isExecutionsLoading={isLoading}
            refetchTemplateExecutions={refetchExecutions}
          />
        )}
        {activeLink?.name === "feedback" && <Feedback />}
        {activeLink?.name === "api" && <ApiAccess template={template} />}
        {activeLink?.name === "extension" && <Extension />}
        {activeLink?.name === "details" && <TemplateDetails template={template} />}
      </Drawer>
    </Box>
  );
};
